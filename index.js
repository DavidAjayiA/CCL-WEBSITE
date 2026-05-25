// Video overlay click handler
const videoOverlay = document.getElementById('video-overlay');
const heroVideo = document.getElementById('hero-video');

if (videoOverlay && heroVideo) {
  videoOverlay.addEventListener('click', () => {
    videoOverlay.classList.add('hidden');
    heroVideo.play();
  });

  // Show overlay again when video ends
  heroVideo.addEventListener('ended', () => {
    videoOverlay.classList.remove('hidden');
  });
}

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const ans = item.querySelector('.faq-a');
    const isOpen = ans.classList.contains('open');
    document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-q').forEach(b => b.classList.remove('open'));
    if (!isOpen) { ans.classList.add('open'); btn.classList.add('open'); }
  });
});

// ── EXECUTIVE SLIDESHOW ──
document.addEventListener('DOMContentLoaded', function () {
  const track    = document.getElementById('execTrack');
  const slides   = Array.from(document.querySelectorAll('.exec-slide'));
  const dotsWrap = document.getElementById('execDots');
  const progress = document.getElementById('execProgress');
  const prevBtn  = document.getElementById('execPrev');
  const nextBtn  = document.getElementById('execNext');

  if (!track || !slides.length) return;

  const total = slides.length;
  let current = 0;
  let autoTimer = null;

  // Build dots
  dotsWrap.innerHTML = '';
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'exec-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function updateUI() {
    // Move track
    track.style.transform = 'translateX(-' + (current * 100) + '%)';

    // Active class for animations
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));

    // Dots
    document.querySelectorAll('.exec-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });

    // Progress bar
    progress.style.width = ((current + 1) / total * 100) + '%';
  }

  function goTo(index) {
    current = ((index % total) + total) % total;
    updateUI();
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function () { goTo(current + 1); }, 5000);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  // Wire up buttons
  prevBtn.addEventListener('click', function () { goTo(current - 1); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); });

  // Touch / swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Pause on hover
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  // Init
  updateUI();
  startAuto();
});