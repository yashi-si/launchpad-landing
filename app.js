document.addEventListener('DOMContentLoaded', () => {
  // Style card selection
  const styleCards = document.querySelectorAll('.style-card');
  styleCards.forEach(card => {
    card.addEventListener('click', () => {
      styleCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // Generate button
  const generateBtn = document.querySelector('.btn-generate');
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      const activeStyle = document.querySelector('.style-card.active');
      const textarea = document.querySelector('.prompt-box textarea');
      const prompt = textarea ? textarea.value : '';
      const style = activeStyle ? activeStyle.dataset.style : 'none';

      const placeholder = document.querySelector('.preview-placeholder');
      if (placeholder) {
        placeholder.innerHTML =
          '<div class="preview-loading">' +
            '<div class="loading-dots"><span></span><span></span><span></span></div>' +
            '<p>Generating with <strong>' + style + '</strong> style\u2026</p>' +
          '</div>';

        setTimeout(() => {
          placeholder.innerHTML =
            '<div class="preview-done">' +
              '<div class="preview-icon">\u2728</div>' +
              '<p><strong>Site generated!</strong></p>' +
              '<p style="margin-top:6px;font-size:13px;color:var(--ink-muted);">' +
                '"' + (prompt || 'No prompt entered') + '"' +
              '</p>' +
            '</div>';
        }, 2000);
      }
    });
  }

  // Scroll reveal with IntersectionObserver
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
