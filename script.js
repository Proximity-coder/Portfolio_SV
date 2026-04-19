/* Sofia Vicinanza — Nocturne */

/* ======================
   Scroll reveal
   ====================== */
(function initReveal(){
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  /* Fallback: show everything if IntersectionObserver not supported */
  if (!('IntersectionObserver' in window)){
    reveals.forEach(function(r){ r.classList.add('in', 'done'); });
    return;
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        var el = entry.target;
        el.classList.add('in');
        io.unobserve(el);

        /* After transition completes, release GPU layer */
        el.addEventListener('transitionend', function handler(e){
          if (e.propertyName === 'transform'){
            el.classList.add('done');
            el.removeEventListener('transitionend', handler);
          }
        });
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

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
