/* Keeping AI on Things guide pages: copy buttons, tabs, reveals, scroll progress. */
(function(){
  /* Copy buttons */
  document.querySelectorAll('.copy-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var el=document.getElementById(btn.getAttribute('data-target'));
      if(!el)return;
      var text=el.innerText;
      function ok(){var t=btn.innerHTML;btn.innerHTML='Copied!';btn.classList.add('done');setTimeout(function(){btn.innerHTML=t;btn.classList.remove('done');},1600);}
      function fallback(){var r=document.createRange();r.selectNode(el);var s=window.getSelection();s.removeAllRanges();s.addRange(r);try{document.execCommand('copy');ok();}catch(e){}s.removeAllRanges();}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(ok).catch(fallback);}else{fallback();}
    });
  });

  /* Tabs: any [data-tabs] container with .tab-btn[data-panel] + .tab-panel ids */
  document.querySelectorAll('[data-tabs]').forEach(function(group){
    var btns=group.querySelectorAll('.tab-btn');
    btns.forEach(function(btn){
      btn.addEventListener('click',function(){
        btns.forEach(function(b){b.classList.remove('active');b.setAttribute('aria-selected','false');});
        group.querySelectorAll('.tab-panel').forEach(function(p){p.classList.remove('active');});
        btn.classList.add('active');btn.setAttribute('aria-selected','true');
        var panel=group.querySelector('#'+btn.getAttribute('data-panel'));
        if(panel)panel.classList.add('active');
      });
    });
  });

  /* Reveal on scroll (above-the-fold reveals instantly) */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
    },{rootMargin:'0px 0px -8% 0px',threshold:.08});
    document.querySelectorAll('.reveal').forEach(function(el){
      if(el.getBoundingClientRect().top<window.innerHeight*.92){el.classList.add('in');}
      else{io.observe(el);}
    });
  }else{
    document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
  }

  /* Scroll progress bar */
  var bar=document.querySelector('.progress i');
  if(bar){
    var ticking=false;
    function update(){
      var h=document.documentElement;
      var max=h.scrollHeight-h.clientHeight;
      bar.style.transform='scaleX('+(max>0?(h.scrollTop/max):0)+')';
      ticking=false;
    }
    window.addEventListener('scroll',function(){
      if(!ticking){requestAnimationFrame(update);ticking=true;}
    },{passive:true});
    update();
  }
})();

/* Stepper: one step open at a time, done tracking, progress meter */
(function(){
  document.querySelectorAll('[data-stepper]').forEach(function(st){
    var steps=Array.prototype.slice.call(st.querySelectorAll('.step'));
    var fill=st.querySelector('.stepper-progress i');
    var doneEl=st.querySelector('.stepper-done');
    function paint(){
      var done=st.querySelectorAll('.step.done').length;
      if(fill)fill.style.width=(steps.length?Math.round(done/steps.length*100):0)+'%';
      if(doneEl)doneEl.textContent=done+' of '+steps.length+' done';
    }
    function openStep(step){
      steps.forEach(function(s){s.classList.remove('open');});
      if(step){step.classList.add('open');}
    }
    steps.forEach(function(s,i){
      var head=s.querySelector('.step-head');
      if(head)head.addEventListener('click',function(){
        if(s.classList.contains('open')){s.classList.remove('open');}
        else{openStep(s);}
      });
      var next=s.querySelector('.step-next');
      if(next)next.addEventListener('click',function(){
        s.classList.add('done');
        var n=steps[i+1];
        openStep(n||null);
        paint();
        if(n){var top=n.getBoundingClientRect().top+window.pageYOffset-90;window.scrollTo({top:top,behavior:'smooth'});}
      });
    });
    paint();
  });
})();
