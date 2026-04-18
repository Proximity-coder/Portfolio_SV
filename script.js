/* Sofia Vicinanza — Nocturne */

/* ======================
   Custom cursor
   Skipped on touch devices (hover:none)
   ====================== */
(function initCursor(){
  if (window.matchMedia('(hover: none)').matches) return;

  var cursor = document.createElement('div');
  cursor.className = 'cursor';
  var outline = document.createElement('div');
  outline.className = 'cursor-outline';
  document.body.appendChild(outline);
  document.body.appendChild(cursor);

  /* Target (real mouse position) and follow (lagged outline position) */
  var tx = -100, ty = -100;  // target
  var fx = -100, fy = -100;  // follow
  var dotX = -100, dotY = -100;
  var running = false;
  var hovering = false;

  document.addEventListener('mousemove', function(e){
    tx = e.clientX;
    ty = e.clientY;
    dotX = tx;
    dotY = ty;
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  }, { passive: true });

  function tick(){
    /* Dot: snaps to mouse each frame, via translate3d to stay on GPU */
    cursor.style.transform = 'translate3d(' + (dotX - 4) + 'px,' + (dotY - 4) + 'px,0)';

    /* Outline: lerps towards target, also translate3d */
    fx += (tx - fx) * 0.18;
    fy += (ty - fy) * 0.18;

    /* Sub-pixel snapping: once close enough, stop the loop until next mousemove.
       This saves battery and stops Chrome from running a pointless render loop. */
    var dx = tx - fx, dy = ty - fy;
    var near = dx*dx + dy*dy < 0.1;

    /* Feed position into CSS custom props so the hover scale can compose with translate */
    if (hovering) {
      outline.style.setProperty('--ox', (fx - 17) + 'px');
      outline.style.setProperty('--oy', (fy - 17) + 'px');
    } else {
      outline.style.transform = 'translate3d(' + (fx - 17) + 'px,' + (fy - 17) + 'px,0) scale(1)';
    }

    if (near) {
      running = false;
    } else {
      requestAnimationFrame(tick);
    }
  }

  /* Hover handling — class-based so the CSS transition takes over */
  function onEnter(){
    hovering = true;
    outline.style.setProperty('--ox', (fx - 17) + 'px');
    outline.style.setProperty('--oy', (fy - 17) + 'px');
    outline.classList.add('is-hover');
  }
  function onLeave(){
    hovering = false;
    outline.classList.remove('is-hover');
    /* Resume the tick loop so the outline snaps back to following the cursor */
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  }
  document.querySelectorAll('a, button, input, textarea, .card').forEach(function(el){
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
  });

  /* Hide cursor when leaving window */
  document.addEventListener('mouseleave', function(){
    cursor.style.opacity = '0';
    outline.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function(){
    cursor.style.opacity = '1';
    outline.style.opacity = '1';
  });
})();

/* ======================
   Scroll reveal
   ====================== */
(function initReveal(){
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  /* Fallback: show everything if IntersectionObserver not supported */
  if (!('IntersectionObserver' in window)){
    reveals.forEach(function(r){ r.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(function(r){ io.observe(r); });
})();

/* ======================
   Mobile menu toggle
   ====================== */
function toggleMenu() {
  var links = document.getElementById('nav-links');
  var burger = document.getElementById('hamburger');
  if (links) links.classList.toggle('open');
  if (burger) burger.classList.toggle('open');
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('nav')) {
    var links = document.getElementById('nav-links');
    var burger = document.getElementById('hamburger');
    if (links) links.classList.remove('open');
    if (burger) burger.classList.remove('open');
  }
});

/* ======================
   Contact form handler
   Only runs if the form exists
   ====================== */
document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    var btn = document.getElementById('submit-btn');
    var success = document.getElementById('form-success');
    var error = document.getElementById('form-error');
    var originalText = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled = true;
    success.style.display = 'none';
    error.style.display = 'none';

    try {
      var res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      var data = await res.json();
      if (data.success) {
        success.style.display = 'block';
        form.reset();
      } else {
        error.style.display = 'block';
      }
    } catch(err) {
      error.style.display = 'block';
    }

    btn.textContent = originalText;
    btn.disabled = false;
  });
});
