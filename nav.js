/* nav.js — inject shared nav + footer into every page */
(function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const navLinks = [
    { href: 'index.html',      label: 'Home' },
    { href: 'about.html',      label: 'About' },
    { href: 'programs.html',   label: 'Programs' },
    { href: 'events.html',     label: 'Events' },
    // { href: 'membership.html', label: 'Membership' },
    { href: 'executive.html',  label: 'Executive' },
    { href: 'blog.html',       label: 'Insights' },
    // { href: 'alumni.html',     label: 'Alumni' },
    { href: 'gallery.html',    label: 'Gallery' },
    // { href: 'partners.html',   label: 'Partners' },
    { href: 'contact.html',    label: 'Contact' },
  ];

  const navHTML = `
  <nav class="site-nav" id="siteNav">
    <a href="index.html" class="nav-logo">
      <div class="nav-logo-mark">
        <img src="ccl_logo-removebg-preview.png">
      </div>
      <div class="nav-logo-text">
        Consulting Club of Lagos
        <span class="nav-logo-sub">University Society</span>
      </div>
    </a>
    <ul class="nav-links">
      ${navLinks.map(l => `<li><a href="${l.href}" class="${currentPage === l.href ? 'active' : ''}">${l.label}</a></li>`).join('')}
    </ul>
    <a href="https://forms.gle/YUV48qoZho97rr2R9" target="_blank" class="nav-cta-btn btn">Join CCL →</a>
    <button class="nav-hamburger" id="hamburger" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
  </nav>
  <div class="nav-mobile-menu" id="mobileMenu">
    ${navLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
    <a href="membership.html" style="color:var(--green);font-weight:600;margin-top:8px;">Join CCL →</a>
  </div>`;

  const footerHTML = `
  <footer class="site-footer">
    <div class="footer-grid">
      <div class="footer-brand-col">
        <div class="footer-logo">
          <div class="footer-logo-mark">CCL</div>
          <div class="footer-logo-name">Consulting Club of Lagos</div>
        </div>
        <p class="footer-desc">Equipping the next generation of African business leaders with the skills, networks, and mindset to shape the continent's future.</p>
        <div class="footer-social">
          <a href="https://www.linkedin.com/company/consulting-club-of-lagos/posts/?feedView=all" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <a href="https://www.instagram.com/consultingcluboflagos/" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Instagram">
            <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="https://consultingcluboflagos.substack.com/" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Substack">
          <svg viewBox="0 0 24 24"><path d="M22.539 8.242H1.46V4h21.079v4.242zM1.46 10.253v7.506h21.079v-7.506H1.46zm0 8.771V21h21.079v-2.476H1.46z"/></svg>
          </a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Navigate</h4>
        <ul>
          <li><a href="about.html">About CCL</a></li>
          <li><a href="programs.html">Programs</a></li>
          <li><a href="events.html">Events</a></li>
          <li><a href="index.html">Home</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Community</h4>
        <ul>
          <li><a href="blog.html">Insights</a></li>
          <li><a href="executive.html">Executive Team</a></li>
          <li><a href="gallery.html">Gallery</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul>
          <li><a href="contact.html">Get in Touch</a></li>
          <li><a href="mailto:consultingcluboflagos@gmail.com">consultingcluboflagos@gmail.com</a></li>
          <li><a href="https://www.google.com/maps/place/University+of+Lagos/@6.515759,3.3898447,17z/data=!3m1!4b1!4m6!3m5!1s0x103b8d24c04d3e75:0x7347f1a6be13e004!8m2!3d6.515759!4d3.3898447!16zL20vMDZnOWdo?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">University of Lagos, Akoka, Yaba, Lagos</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span class="footer-copy">© ${new Date().getFullYear()} Consulting Club of Lagos. All rights reserved.</span>
      <span class="footer-back">Built for Africa's future consultants.</span>
    </div>
  </footer>`;

  document.body.insertAdjacentHTML('afterbegin', navHTML);
  document.body.insertAdjacentHTML('beforeend', footerHTML);

  // Hamburger toggle
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('open');
  });

  // Scroll observer for animations
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.animationDelay = (e.target.dataset.delay || 0) + 's';
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.anim').forEach(el => observer.observe(el));
})();
