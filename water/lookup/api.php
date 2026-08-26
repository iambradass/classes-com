<?php
/**
 * Water research lookup API - classes.cnattitle.com/water/lookup/api.php
 *
 * Input:  ?address=<free-text street address, Texas>
 * Output: JSON research starting points for the TREC water disclosure:
 *         groundwater district(s) at the point (TWDB polygon layer, which
 *         includes the EAA and both subsidence districts), districts within
 *         a boundary buffer, drillers-report wells nearby, plugging reports,
 *         district contact info (TCEQ contact list, June 2026), and links.
 *
 * This endpoint returns RESEARCH STARTING POINTS ONLY. It never decides
 * which contract box applies and it is not legal advice.
 *
 * Data sources are queried live:
 *   - Census Bureau geocoder (address -> point + county)
 *   - TWDB ArcGIS: Base/GroundWaterConservationDistricts, Public/WellReports,
 *     Public/PluggingReports
 * Each sub-query fails soft: a warning is added and the rest still returns.
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$TWDB = 'https://services.twdb.texas.gov/arcgis/rest/services';
$BUFFER_BOUNDARY_M = 250;   // "a district boundary runs near this point" check
$WELLS_NEAR_M      = 402;   // quarter mile
$WELLS_FAR_M       = 805;   // half mile
$MAX_WELLS         = 15;

$address = isset($_GET['address']) ? trim((string)$_GET['address']) : '';
if ($address === '' || strlen($address) > 200) {
  http_response_code(400);
  echo json_encode(['error' => 'bad_request', 'message' => 'Provide ?address=']);
  exit;
}

$warnings = [];

function fetch_json($url, $timeout = 12) {
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => $timeout,
    CURLOPT_CONNECTTIMEOUT => 6,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_USERAGENT      => 'CNAT-WaterLookup/1.0 (classes.cnattitle.com)',
  ]);
  $body = curl_exec($ch);
  $err  = curl_error($ch);
  curl_close($ch);
  if ($body === false) return [null, $err ?: 'request failed'];
  $j = json_decode($body, true);
  if ($j === null) return [null, 'bad json'];
  return [$j, null];
}

function arcgis_query($base, $params, &$warnings, $label) {
  $url = $base . '?' . http_build_query($params);
  list($j, $err) = fetch_json($url, 15);
  if ($err !== null || isset($j['error'])) {
    $warnings[] = $label . ' query failed; that section is incomplete';
    return null;
  }
  return $j;
}

/* ---------- 1. geocode (coords + county in one call) ---------- */
$geoUrl = 'https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?' . http_build_query([
  'address' => $address, 'benchmark' => 'Public_AR_Current',
  'vintage' => 'Current_Current', 'layers' => 'Counties', 'format' => 'json',
]);
list($geo, $geoErr) = fetch_json($geoUrl, 12);
$match = $geo['result']['addressMatches'][0] ?? null;

if ($match === null) {
  // fallback: plain locations endpoint (no county)
  $geoUrl2 = 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?' . http_build_query([
    'address' => $address, 'benchmark' => 'Public_AR_Current', 'format' => 'json',
  ]);
  list($geo2, $e2) = fetch_json($geoUrl2, 12);
  $match = $geo2['result']['addressMatches'][0] ?? null;
}
if ($match === null) {
  http_response_code(404);
  echo json_encode(['error' => 'no_match',
    'message' => 'Could not locate that address. Try adding the city and ZIP, or check the spelling.']);
  exit;
}

$lon = $match['coordinates']['x'];
$lat = $match['coordinates']['y'];
$matchedAddress = $match['matchedAddress'] ?? $address;
$county = $match['geographies']['Counties'][0]['NAME'] ?? null;

$pt = [
  'geometry' => $lon . ',' . $lat,
  'geometryType' => 'esriGeometryPoint',
  'inSR' => 4326,
  'spatialRel' => 'esriSpatialRelIntersects',
  'returnGeometry' => 'false',
  'f' => 'json',
];

/* ---------- 2. district(s) at the point ---------- */
$gcdBase = $TWDB . '/Base/GroundWaterConservationDistricts/MapServer/0/query';
$atPoint = arcgis_query($gcdBase, $pt + ['outFields' => 'DistrictName'], $warnings, 'district');
$districtNames = [];
if ($atPoint !== null) {
  foreach (($atPoint['features'] ?? []) as $f) {
    $districtNames[] = $f['attributes']['DistrictName'];
  }
}

/* ---------- 3. district boundary within buffer ---------- */
$nearBoundary = [];
$buffered = arcgis_query($gcdBase, $pt + [
  'outFields' => 'DistrictName',
  'distance' => $BUFFER_BOUNDARY_M, 'units' => 'esriSRUnit_Meter',
], $warnings, 'district buffer');
if ($buffered !== null) {
  foreach (($buffered['features'] ?? []) as $f) {
    $n = $f['attributes']['DistrictName'];
    if (!in_array($n, $districtNames, true)) $nearBoundary[] = $n;
  }
}

/* ---------- 4. wells nearby (drillers reports) ---------- */
$wellsBase = $TWDB . '/Public/WellReports/MapServer/0/query';
$countNear = arcgis_query($wellsBase, $pt + [
  'distance' => $WELLS_NEAR_M, 'units' => 'esriSRUnit_Meter', 'returnCountOnly' => 'true',
], $warnings, 'wells quarter-mile count');
$countFar = arcgis_query($wellsBase, $pt + [
  'distance' => $WELLS_FAR_M, 'units' => 'esriSRUnit_Meter', 'returnCountOnly' => 'true',
], $warnings, 'wells half-mile count');
$wellRecs = arcgis_query($wellsBase, $pt + [
  'distance' => $WELLS_FAR_M, 'units' => 'esriSRUnit_Meter',
  'outFields' => 'WellReportTrackingNumber,WellType,ProposedUse,WellOwner,WellStreet,WellCity,DateOfWellCompletion,BoreholeDepthFt',
  'resultRecordCount' => $MAX_WELLS,
], $warnings, 'well records');

$wells = [];
if ($wellRecs !== null) {
  foreach (($wellRecs['features'] ?? []) as $f) {
    $a = $f['attributes'];
    $yr = null;
    if (!empty($a['DateOfWellCompletion'])) $yr = (int)gmdate('Y', (int)($a['DateOfWellCompletion'] / 1000));
    $wells[] = [
      'tracking' => $a['WellReportTrackingNumber'] ?? null,
      'type'     => $a['WellType'] ?? null,
      'use'      => $a['ProposedUse'] ?? null,
      'owner'    => $a['WellOwner'] ?? null,
      'street'   => trim(($a['WellStreet'] ?? '') . ', ' . ($a['WellCity'] ?? ''), ', '),
      'year'     => $yr,
      'depthFt'  => $a['BoreholeDepthFt'] ?? null,
    ];
  }
}

/* ---------- 5. plugging reports nearby ---------- */
$plugCount = arcgis_query($TWDB . '/Public/PluggingReports/MapServer/0/query', $pt + [
  'distance' => $WELLS_FAR_M, 'units' => 'esriSRUnit_Meter', 'returnCountOnly' => 'true',
], $warnings, 'plugging reports');

/* ---------- 6. district contacts + special-authority notes ---------- */
$contacts = json_decode(@file_get_contents(__DIR__ . '/district-contacts.json'), true) ?: [];
$districts = [];
foreach ($districtNames as $n) {
  $c = $contacts[$n] ?? null;
  $note = null;
  if (stripos($n, 'Edwards Aquifer Authority') !== false || stripos($n, 'Subsidence') !== false) {
    $note = 'Not a Chapter 36 GCD, but it regulates wells here, and the definition on TREC Form 61-0 is written to include it. It belongs in the 2(A) answer.';
  }
  $districts[] = [
    'layerName' => $n,
    'fullName'  => $c['fullName'] ?? $n,
    'phone'     => $c['phone'] ?? null,
    'website'   => $c['website'] ?? null,
    'note'      => $note,
  ];
}

echo json_encode([
  'query'          => $address,
  'matchedAddress' => $matchedAddress,
  'coords'         => ['lat' => $lat, 'lon' => $lon],
  'county'         => $county,
  'districts'      => $districts,
  'nearBoundary'   => $nearBoundary,
  'wells' => [
    'quarterMileCount' => $countNear['count'] ?? null,
    'halfMileCount'    => $countFar['count'] ?? null,
    'nearest'          => $wells,
    'shown'            => count($wells),
  ],
  'pluggingHalfMileCount' => $plugCount['count'] ?? null,
  'links' => [
    'tceqMap'        => 'https://www.tceq.texas.gov/goto/gcd',
    'twdbDirectory'  => 'https://www.twdb.texas.gov/groundwater/conservation_districts/',
    'tagdMembers'    => 'https://texasgroundwater.org/members/current-members/district-members/',
    'wellSearch'     => 'https://www.twdb.texas.gov/groundwater/data/drillersdb.asp',
    'cadDirectory'   => 'https://comptroller.texas.gov/taxes/property-tax/county-directory/',
    'landId'         => 'https://id.land/',
    'trec610'        => 'https://www.trec.texas.gov/sites/default/files/pdf-forms/61-0.pdf',
  ],
  'caveats' => [
    'Research starting points only. This tool never decides which box in the contract applies, and it is not legal advice.',
    'District boundaries checked at the geocoded point. On acreage, part of the parcel can sit in a district the point misses; confirm on the district map.',
    'Well locations are driller-reported, not state-verified. Records run roughly 2003-forward; older wells may exist with no report on file.',
    'The seller answers the disclosure. Verify everything with the district before it goes on a form.',
  ],
  'warnings'    => $warnings,
  'generatedAt' => gmdate('c'),
  'sources'     => 'Census Bureau geocoder; TWDB GCD, WellReports and PluggingReports services; TCEQ GCD contact list (June 2026)',
]);
