/* The resource catalogue. Single source of truth: the library page and the
   site chrome (related links at the foot of every resource) both read this.
   Add an entry here and it appears in search, in the filters, and in the
   related lists automatically.

   t title | u url | k kind | c class | d blurb
   g controlled topic tags (chips) | s hidden search synonyms            */
window.CNAT_RESOURCES = [
  {t:"Keeping AI on Things: the resource hub", u:"/keeping-ai-on-things/", k:"Hub", c:"Keeping AI on Things",
   d:"The tabbed hub for the class, with all eleven walkthrough guides in one place.",
   g:["ai","claude","getting started","automation"], s:"hub index overview start"},

  {t:"Set Up Your AI Second Brain", u:"/keeping-ai-on-things/guides/ai-second-brain/", k:"Guide", c:"Keeping AI on Things",
   d:"Give your assistant a memory so it stops asking you the same questions every time.",
   g:["ai","claude","getting started"], s:"memory project custom instructions setup configure second brain"},

  {t:"AI Transaction Coordination", u:"/keeping-ai-on-things/guides/ai-transaction-coordinator/", k:"Guide", c:"Keeping AI on Things",
   d:"Hand a contract to the AI and get every deadline back on a timeline.",
   g:["transactions","automation","ai"], s:"contract deadlines timeline tc coordinator option period"},

  {t:"Connect Your Calendar to Your AI Assistant", u:"/keeping-ai-on-things/guides/calendar-connection/", k:"Guide", c:"Keeping AI on Things",
   d:"Let the assistant see your week so it can schedule and remind without you retyping anything.",
   g:["ai","claude","automation"], s:"calendar google schedule appointments connect config"},

  {t:"The Campaign Autopilot", u:"/keeping-ai-on-things/guides/campaign-autopilot/", k:"Guide", c:"Keeping AI on Things",
   d:"Turn one idea into a full email and social campaign that goes out on a schedule.",
   g:["marketing","automation","ai"], s:"email campaign drip newsletter posts schedule"},

  {t:"The CMA Assistant", u:"/keeping-ai-on-things/guides/cma-assistant/", k:"Guide", c:"Keeping AI on Things",
   d:"Build a comparative market analysis with the reasoning written out, not just numbers.",
   g:["listings","sellers","ai"], s:"cma pricing comps valuation market analysis price opinion"},

  {t:"Connect Your CRM to Your AI Assistant", u:"/keeping-ai-on-things/guides/connect-your-crm/", k:"Guide", c:"Keeping AI on Things",
   d:"Wire your contact database to the assistant so it can actually work with your people.",
   g:["crm","ai","automation"], s:"database contacts connect integration gohighlevel follow up boss config"},

  {t:"Turn a CSV Export Into a Campaign", u:"/keeping-ai-on-things/guides/csv-to-campaign/", k:"Guide", c:"Keeping AI on Things",
   d:"Take the spreadsheet your database spits out and turn it into something that earns.",
   g:["crm","marketing","automation"], s:"csv export spreadsheet list database campaign import"},

  {t:"The Farm Watchlist", u:"/keeping-ai-on-things/guides/farm-watchlist/", k:"Guide", c:"Keeping AI on Things",
   d:"Watch a neighborhood automatically and know the moment something moves.",
   g:["farming","prospecting","automation"], s:"neighborhood geographic farm watch alerts sold listed"},

  {t:"Build a Neighborhood Landing Page With AI", u:"/keeping-ai-on-things/guides/farming-landing-pages/", k:"Guide", c:"Keeping AI on Things",
   d:"A page for the neighborhood you work, written and built without a web designer.",
   g:["farming","marketing"], s:"neighborhood landing page website seller leads farm"},

  {t:"Market Research Routines", u:"/keeping-ai-on-things/guides/market-research-routines/", k:"Guide", c:"Keeping AI on Things",
   d:"Standing questions that keep you the best informed person in every listing appointment.",
   g:["market data","ai","listings"], s:"research stats trends reports prompts routines"},

  {t:"The Reverse Prospecting Engine", u:"/keeping-ai-on-things/guides/reverse-prospecting-engine/", k:"Guide", c:"Keeping AI on Things",
   d:"Find the agents whose buyers already match your listing, and reach out first.",
   g:["prospecting","listings","automation"], s:"reverse prospecting buyer agents matches showings"},

  {t:"AI Agent Builds: the field manual", u:"/ai-builds/", k:"Manual", c:"Keeping AI on Things",
   d:"Ten complete systems you can build, each with a by-hand version for tonight and a version that runs on its own. Includes every prompt and what it really costs.",
   g:["ai","automation","claude","getting started"], s:"prompts builds playbook costs field manual custom instructions configs"},

  {t:"01 Farm Intelligence Engine", u:"/ai-builds/#b01", k:"Build", c:"Keeping AI on Things",
   d:"A live list of every home in your neighborhood, watched weekly, plus your monthly neighborhood report.",
   g:["farming","prospecting","market data"], s:"farm neighborhood title data postcard door knock report"},

  {t:"02 Contract-to-Close Copilot", u:"/ai-builds/#b02", k:"Build", c:"Keeping AI on Things",
   d:"Reads a signed contract and puts every deadline on your calendar and to-do list.",
   g:["transactions","automation"], s:"contract deadlines calendar tasks intro emails closing"},

  {t:"03 Daily Call List Miner", u:"/ai-builds/#b03", k:"Build", c:"Keeping AI on Things",
   d:"Five people to call every morning, with the reason and the opening message written.",
   g:["crm","prospecting","past clients"], s:"database miner call list five names morning openers"},

  {t:"04 Home Anniversary Equity Report", u:"/ai-builds/#b04", k:"Build", c:"Keeping AI on Things",
   d:"A what-is-my-home-worth update to every past client on their closing anniversary.",
   g:["past clients","marketing","automation"], s:"equity anniversary home value past client touch"},

  {t:"05 Speed-to-Lead SMS AI", u:"/ai-builds/#b05", k:"Build", c:"Keeping AI on Things",
   d:"Texts a new lead back in under a minute, qualifies them, and books the appointment.",
   g:["prospecting","automation"], s:"leads sms text speed to lead response isa follow up"},

  {t:"06 Showing Debrief Loop", u:"/ai-builds/#b06", k:"Build", c:"Keeping AI on Things",
   d:"A two-minute voice note after a showing becomes a recap email and better notes on file.",
   g:["buyers","crm","ai"], s:"showing voice note recap buyer preferences debrief"},

  {t:"07 Instant CMA and Net Sheet", u:"/ai-builds/#b07", k:"Build", c:"Keeping AI on Things",
   d:"Type an address, get a branded listing-appointment package with the seller's bottom line.",
   g:["listings","sellers","ai"], s:"cma net sheet pricing comps listing appointment proceeds"},

  {t:"08 Single-Property Websites", u:"/ai-builds/#b08", k:"Build", c:"Keeping AI on Things",
   d:"Every listing gets its own page and a scannable code for the yard sign.",
   g:["listings","marketing"], s:"property website yard sign qr code single property"},

  {t:"09 Post-Closing Engine", u:"/ai-builds/#b09", k:"Build", c:"Keeping AI on Things",
   d:"A Just Closed post, a review request, and next year's anniversary note, all set up at funding.",
   g:["past clients","marketing","social media"], s:"closing reviews just closed google review referrals"},

  {t:"10 Compliance Linter", u:"/ai-builds/#b10", k:"Build", c:"Keeping AI on Things",
   d:"Checks every description, post, ad, and mailer for fair housing and advertising problems before it goes out.",
   g:["compliance","marketing"], s:"fair housing trec advertising mls rules review legal"},

  {t:"Social That Closes: the hub", u:"/bk-social/", k:"Hub", c:"Social That Closes",
   d:"Everything handed out at the Social That Closes session in one place.",
   g:["social media","marketing","getting started"], s:"bk realty social that closes hub index"},

  {t:"Social That Closes: the deck", u:"/bk-social/BK-Social-That-Closes-Deck", k:"Deck", c:"Social That Closes",
   d:"The full slide deck from the session, to page back through at your own speed.",
   g:["social media","marketing"], s:"slides deck presentation bk realty"},

  {t:"Social That Closes: agent workbook", u:"/bk-social/workbook", k:"Workbook", c:"Social That Closes",
   d:"The fill-in workbook: your posting plan, your pillars, and what to do each week.",
   g:["social media","marketing"], s:"workbook worksheet planner pillars posting plan handout"},

  {t:"Killing Your Reach: 15 Social Media Myths", u:"/bk-social/myths", k:"Handout", c:"Social That Closes",
   d:"Fifteen things agents believe about the algorithm that are quietly costing them reach.",
   g:["social media","marketing"], s:"algorithm reach myths handout engagement"},

  {t:"Water Rights & the New Groundwater Disclosure: Field Guide", u:"/water/Water-Rights-Field-Guide.pdf", k:"Handout", c:"Water Rights",
   d:"The 6-page class handout: the Paragraph 7.I five-part test, six listing-appointment questions, the Form 61-0 question map, district lookup links, a practice worksheet, and five AI prompts.",
   g:["compliance","listings","sellers","transactions"], s:"water rights groundwater disclosure 61-0 7.I well gcd district trec back-up backup 11-9 62-0 spyglass"}
];
