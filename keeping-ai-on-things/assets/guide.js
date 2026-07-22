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
        if(n){setTimeout(function(){
          var h=n.querySelector('.step-head');if(!h)return;
          var r=h.getBoundingClientRect();
          if(r.top<80||r.top>window.innerHeight-180){
            window.scrollTo({top:r.top+window.pageYOffset-110,behavior:'smooth'});
          }
        },430);}
      });
    });
    paint();
  });
})();


/* Prompt modal: open a prompt in an overlay so users keep their place */
(function(){
  function copyText(text,btn){
    function ok(){var t=btn.innerHTML;btn.innerHTML='Copied!';btn.classList.add('done');setTimeout(function(){btn.innerHTML=t;btn.classList.remove('done');},1600);}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(ok).catch(function(){ok();});}else{ok();}
  }
  function openModal(title,text){
    var wrap=document.createElement('div');
    wrap.className='pmodal';
    wrap.innerHTML='<div class="pmodal-backdrop"></div>'+
      '<div class="pmodal-panel" role="dialog" aria-modal="true">'+
      '<div class="prompt-bar"><span class="pdot r"></span><span class="pdot y"></span><span class="pdot g"></span>'+
      '<span class="prompt-name"></span>'+
      '<button class="copy-btn pmodal-copy" type="button">Copy</button>'+
      '<button class="pmodal-x" type="button" aria-label="Close">&#10005;</button></div>'+
      '<pre></pre></div>';
    wrap.querySelector('.prompt-name').textContent=title;
    wrap.querySelector('pre').textContent=text;
    function close(){document.body.removeChild(wrap);document.removeEventListener('keydown',esc);document.body.style.overflow='';}
    function esc(e){if(e.key==='Escape')close();}
    wrap.querySelector('.pmodal-backdrop').addEventListener('click',close);
    wrap.querySelector('.pmodal-x').addEventListener('click',close);
    wrap.querySelector('.pmodal-copy').addEventListener('click',function(){copyText(text,this);});
    document.addEventListener('keydown',esc);
    document.body.style.overflow='hidden';
    document.body.appendChild(wrap);
  }
  document.querySelectorAll('.prompt-open').forEach(function(btn){
    btn.addEventListener('click',function(){
      var src=document.getElementById(btn.getAttribute('data-prompt'));
      if(!src)return;
      openModal(btn.textContent.replace(/^View prompt:\s*/i,''),src.textContent);
    });
  });
})();
