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

  var mx = -100, my = -100, ox = -100, oy = -100;

  document.addEventListener('mousemove', function(e){
    mx = e.clientX;
    my = e.clientY;
    cursor.style.transform = 'translate(' + (mx - 4) + 'px,' + (my - 4) + 'px)';
  });

  function follow(){
    ox += (mx - ox) * 0.18;
    oy += (my - oy) * 0.18;
    outline.style.transform = 'translate(' + (ox - 17) + 'px,' + (oy - 17) + 'px)';
    requestAnimationFrame(follow);
  }
  follow();

  /* Grow on interactive elements */
  function bindHover(el){
    el.addEventListener('mouseenter', function(){
      outline.style.width = '56px';
      outline.style.height = '56px';
      outline.style.borderColor = 'var(--g3)';
    });
    el.addEventListener('mouseleave', function(){
      outline.style.width = '34px';
      outline.style.height = '34px';
      outline.style.borderColor = 'var(--g2)';
    });
  }
  document.querySelectorAll('a, button, input, textarea, .card').forEach(bindHover);

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
