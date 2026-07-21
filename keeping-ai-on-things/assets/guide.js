document.querySelectorAll('.copy-btn').forEach(function(btn){
  btn.addEventListener('click',function(){
    var el=document.getElementById(btn.getAttribute('data-target'));
    var text=el.innerText;
    function ok(){var t=btn.textContent;btn.textContent='Copied!';btn.classList.add('done');setTimeout(function(){btn.textContent=t;btn.classList.remove('done');},1600);}
    function fallback(){var r=document.createRange();r.selectNode(el);var s=window.getSelection();s.removeAllRanges();s.addRange(r);try{document.execCommand('copy');ok();}catch(e){}s.removeAllRanges();}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(ok).catch(fallback);}else{fallback();}
  });
});
