document.addEventListener('DOMContentLoaded', function() {

  var state = {
    step: 1,
    style: '3d-illustration',
    prompt: '',
    selectedOption: null,
    sections: ['Hero', 'Marquee', 'Mission', 'Features', 'Showcase', 'Social Proof', 'CTA', 'Footer']
  };

  var steps = document.querySelectorAll('.step');
  var dots = document.querySelectorAll('.step-dot');
  var overlay = document.getElementById('loadingOverlay');
  var loadingStatus = document.getElementById('loadingStatus');
  var loadingFill = document.getElementById('loadingFill');

  function goToStep(n) {
    state.step = n;
    steps.forEach(function(s) { s.classList.remove('active'); });
    document.querySelector('.step[data-step="' + n + '"]').classList.add('active');
    dots.forEach(function(d) {
      var ds = parseInt(d.dataset.step);
      d.classList.remove('active', 'done');
      if (ds < n) d.classList.add('done');
      if (ds === n) d.classList.add('active');
    });
  }

  // Navigation
  document.getElementById('toStep2').addEventListener('click', function() { goToStep(2); });
  document.getElementById('backTo1').addEventListener('click', function() { goToStep(1); });
  document.getElementById('toStep3').addEventListener('click', function() {
    state.prompt = document.getElementById('sitePrompt').value;
    showLoading(function() { renderOptions(); goToStep(3); });
  });
  document.getElementById('backTo2').addEventListener('click', function() { goToStep(2); });
  document.getElementById('toStep4').addEventListener('click', function() {
    if (!state.selectedOption) return;
    renderEditor(); goToStep(4);
  });
  document.getElementById('backTo3').addEventListener('click', function() { goToStep(3); });
  document.getElementById('toStep5').addEventListener('click', function() { renderPublish(); goToStep(5); });
  document.getElementById('backTo4').addEventListener('click', function() { goToStep(4); });
  document.getElementById('startOver').addEventListener('click', function() {
    state.selectedOption = null; state.prompt = '';
    document.getElementById('sitePrompt').value = '';
    document.querySelectorAll('.option-card').forEach(function(c) { c.classList.remove('selected'); });
    document.getElementById('toStep4').disabled = true;
    goToStep(1);
  });

  // Style selection
  document.querySelectorAll('.style-cat').forEach(function(cat) {
    cat.addEventListener('click', function() {
      document.querySelectorAll('.style-cat').forEach(function(c) { c.classList.remove('active'); });
      cat.classList.add('active'); state.style = cat.dataset.category;
    });
  });
  document.getElementById('uploadRefBtn').addEventListener('click', function() { document.getElementById('refFileInput').click(); });

  // Prompt suggestions
  document.querySelectorAll('.suggestion-chip').forEach(function(chip) {
    chip.addEventListener('click', function() { document.getElementById('sitePrompt').value = chip.dataset.prompt; });
  });

  // Option selection
  document.querySelectorAll('.option-card').forEach(function(card) {
    card.addEventListener('click', function() {
      document.querySelectorAll('.option-card').forEach(function(c) { c.classList.remove('selected'); });
      card.classList.add('selected'); state.selectedOption = card.dataset.option;
      document.getElementById('toStep4').disabled = false;
    });
  });

  // Sidebar tabs
  document.querySelectorAll('.sidebar-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.sidebar-tab').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.sidebar-panel').forEach(function(p) { p.classList.remove('active'); });
      tab.classList.add('active');
      document.querySelector('[data-panel="' + tab.dataset.tab + '"]').classList.add('active');
    });
  });

  // Chat
  document.getElementById('chatSend').addEventListener('click', sendChat);
  document.getElementById('chatInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
  });
  function sendChat() {
    var input = document.getElementById('chatInput');
    var msg = input.value.trim(); if (!msg) return;
    var msgs = document.getElementById('chatMessages');
    msgs.innerHTML += '<div class="chat-msg user">' + esc(msg) + '</div>';
    input.value = ''; msgs.scrollTop = msgs.scrollHeight;
    setTimeout(function() {
      var r = ['Done! Redesigned that section with cinematic depth and staggered entrance animations.',
        'Applied! Added atmospheric imagery with parallax layering and refined the type hierarchy.',
        'Updated! The new composition uses dramatic scale contrast with slow-reveal motion.',
        'Refined! Adjusted the pacing, added grain texture, and softened the transition curves.'];
      msgs.innerHTML += '<div class="chat-msg ai">' + r[Math.floor(Math.random() * r.length)] + '</div>';
      msgs.scrollTop = msgs.scrollHeight;
    }, 1200);
  }

  // Publish
  document.getElementById('copyUrl').addEventListener('click', function() {
    var b = document.getElementById('copyUrl');
    navigator.clipboard.writeText(document.getElementById('publishUrl').value);
    b.textContent = 'Copied!'; setTimeout(function() { b.textContent = 'Copy'; }, 2000);
  });
  document.getElementById('publishLive').addEventListener('click', function() {
    var b = document.getElementById('publishLive'); b.textContent = 'Publishing...';
    setTimeout(function() { b.textContent = 'Published!'; b.style.background = '#10b981'; }, 1500);
  });
  document.getElementById('downloadCode').addEventListener('click', function() {
    var b = document.getElementById('downloadCode'); b.textContent = 'Preparing...';
    setTimeout(function() { b.textContent = 'Downloaded!'; }, 1000);
    setTimeout(function() { b.textContent = 'Download .zip'; }, 3000);
  });

  // Loading
  function showLoading(cb) {
    overlay.classList.add('active'); loadingFill.style.width = '0%';
    var s = ['Analyzing your aesthetic...','Composing cinematic layouts...','Generating atmospheric imagery...','Choreographing entrance animations...','Final polish and refinement...'];
    var i = 0;
    var iv = setInterval(function() { i++; if (i < s.length) { loadingStatus.textContent = s[i]; loadingFill.style.width = (i/s.length*100)+'%'; }}, 750);
    setTimeout(function() { clearInterval(iv); loadingFill.style.width = '100%'; setTimeout(function() { overlay.classList.remove('active'); cb(); }, 400); }, 4000);
  }

  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  // ===== PALETTES =====
  // Each style has: atmospheric hero image, secondary image, accent colors
  var PALETTES = {
    '3d-illustration': {
      hero: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3579?w=900&h=600&fit=crop&q=80',
      secondary: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop&q=80',
      tertiary: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=500&h=350&fit=crop&q=80',
      accent: '#a78bfa', accent2: '#c084fc', dark: '#0a0118', text: '#e8e0f0', muted: 'rgba(255,255,255,.4)', brand: 'Atelier'
    },
    'flat-vector': {
      hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=600&fit=crop&q=80',
      secondary: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&h=400&fit=crop&q=80',
      tertiary: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=500&h=350&fit=crop&q=80',
      accent: '#34d399', accent2: '#6ee7b7', dark: '#021a14', text: '#d1fae5', muted: 'rgba(255,255,255,.4)', brand: 'Verdant'
    },
    'photography': {
      hero: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&h=600&fit=crop&q=80',
      secondary: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&q=80',
      tertiary: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=350&fit=crop&q=80',
      accent: '#f97316', accent2: '#fb923c', dark: '#0c0a09', text: '#e7e5e4', muted: 'rgba(255,255,255,.4)', brand: 'Meridian'
    },
    'abstract': {
      hero: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=900&h=600&fit=crop&q=80',
      secondary: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600&h=400&fit=crop&q=80',
      tertiary: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&h=350&fit=crop&q=80',
      accent: '#fb7185', accent2: '#fda4af', dark: '#1a0a10', text: '#fce7f3', muted: 'rgba(255,255,255,.4)', brand: 'Prism'
    },
    'gradient-mesh': {
      hero: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=900&h=600&fit=crop&q=80',
      secondary: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=400&fit=crop&q=80',
      tertiary: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=500&h=350&fit=crop&q=80',
      accent: '#818cf8', accent2: '#a5b4fc', dark: '#050a1a', text: '#e0e7ff', muted: 'rgba(255,255,255,.4)', brand: 'Flux'
    },
    'hand-drawn': {
      hero: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=600&fit=crop&q=80',
      secondary: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop&q=80',
      tertiary: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&h=350&fit=crop&q=80',
      accent: '#fbbf24', accent2: '#fde68a', dark: '#1a0f00', text: '#fef3c7', muted: 'rgba(255,255,255,.4)', brand: 'Craft'
    }
  };

  function P() { return PALETTES[state.style] || PALETTES['gradient-mesh']; }

  // ===== OPTION A: Full-bleed cinematic dark =====
  function renderOptionA() {
    var p = P(), u = 'oa' + Date.now();
    var desc = state.prompt ? state.prompt.substring(0, 100) : 'We craft digital experiences that captivate, convert, and leave lasting impressions.';

    return '<style>@keyframes ' + u + 'f{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}' +
      '@keyframes ' + u + 'z{from{transform:scale(1.08)}to{transform:scale(1)}}' +
      '@keyframes ' + u + 'sl{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}' +
      '@keyframes ' + u + 'fl{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-14px) rotate(1deg)}}' +
      '@keyframes ' + u + 'gl{0%,100%{opacity:.3}50%{opacity:.6}}' +
      '@keyframes ' + u + 'breathe{0%,100%{filter:brightness(.85) saturate(1.1);transform:scale(1) translate(0,0)}50%{filter:brightness(1.05) saturate(1.25);transform:scale(1.03) translate(-1%,-0.5%)}}' +
      '@keyframes ' + u + 'drift{0%,100%{transform:scale(1) translate(0,0)}33%{transform:scale(1.02) translate(-0.8%,0.4%)}66%{transform:scale(1.01) translate(0.5%,-0.6%)}}' +
      '@keyframes ' + u + 'lightleak{0%,100%{opacity:.08}30%{opacity:.18}60%{opacity:.05}85%{opacity:.14}}' +
      '</style>' +
      '<div style="font-family:Inter,system-ui,sans-serif;background:' + p.dark + ';color:#fff;overflow:hidden;">' +

      // === HERO: Full-bleed image with breathing + drift ===
      '<div style="position:relative;min-height:420px;overflow:hidden;">' +
        '<div style="position:absolute;inset:-4%;width:108%;height:108%;animation:' + u + 'breathe 8s ease-in-out infinite, ' + u + 'drift 25s ease-in-out infinite;">' +
          '<img src="' + p.hero + '" style="width:100%;height:100%;object-fit:cover;display:block;" alt="">' +
        '</div>' +
        '<div style="position:absolute;inset:0;background:linear-gradient(180deg,' + p.dark + 'cc 0%,' + p.dark + '40 40%,' + p.dark + 'ee 100%);"></div>' +
        '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 40%,' + p.accent + '12,transparent 60%);animation:' + u + 'lightleak 10s ease-in-out infinite;pointer-events:none;"></div>' +
        // Nav
        '<div style="position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:24px 32px;">' +
          '<div style="font-family:Georgia,serif;font-size:18px;font-style:italic;color:' + p.accent + ';letter-spacing:.02em;">' + p.brand + '</div>' +
          '<div style="display:flex;gap:24px;font-size:10px;text-transform:uppercase;letter-spacing:.2em;color:rgba(255,255,255,.45);">' +
            '<span>Services</span><span>Work</span><span>About</span><span>Contact</span>' +
          '</div>' +
        '</div>' +
        // Hero text
        '<div style="position:relative;z-index:2;padding:80px 32px 60px;animation:' + u + 'f 1s ease-out .3s both;">' +
          '<div style="font-size:9px;text-transform:uppercase;letter-spacing:.3em;color:' + p.accent + ';margin-bottom:20px;">Welcome to ' + p.brand + '</div>' +
          '<h1 style="font-family:Georgia,\'Times New Roman\',serif;font-size:48px;font-weight:400;line-height:1;letter-spacing:-.02em;color:#fff;margin-bottom:20px;">' +
            'The Website Your<br><em style="font-style:italic;color:' + p.accent + ';">Brand Deserves</em></h1>' +
          '<p style="font-size:13px;color:rgba(255,255,255,.5);line-height:1.8;max-width:380px;margin-bottom:28px;">' + desc + '</p>' +
          '<div style="display:flex;gap:14px;align-items:center;">' +
            '<div style="padding:12px 28px;background:' + p.accent + ';color:' + p.dark + ';border-radius:4px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Get Started</div>' +
            '<div style="display:flex;align-items:center;gap:8px;font-size:11px;color:rgba(255,255,255,.5);cursor:pointer;"><div style="width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:10px;">&#9654;</div> Watch Reel</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // === MARQUEE ===
      '<div style="border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06);padding:18px 0;overflow:hidden;">' +
        '<div style="display:flex;gap:60px;animation:' + u + 'sl 20s linear infinite;white-space:nowrap;">' +
          marqueeItems(p, ['Stripe','Vercel','Linear','Notion','Figma','Stripe','Vercel','Linear','Notion','Figma']) +
        '</div>' +
      '</div>' +

      // === MISSION: Large serif statement ===
      '<div style="padding:80px 32px;text-align:center;animation:' + u + 'f 1s ease-out .6s both;">' +
        '<div style="font-size:9px;text-transform:uppercase;letter-spacing:.3em;color:' + p.accent + ';margin-bottom:20px;">How it works</div>' +
        '<h2 style="font-family:Georgia,\'Times New Roman\',serif;font-size:36px;font-weight:400;line-height:1.15;letter-spacing:-.01em;color:#fff;max-width:460px;margin:0 auto 24px;">' +
          'You dream it.<br><em style="font-style:italic;color:' + p.accent + ';">We ship it.</em></h2>' +
        '<p style="font-size:12px;color:rgba(255,255,255,.35);max-width:380px;margin:0 auto 28px;line-height:1.8;">' +
          'Share your vision, brand assets, and goals. Our AI engine generates structure and our design AI creates perfect aesthetic alignment.</p>' +
        '<div style="display:inline-block;padding:10px 24px;border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.6);border-radius:4px;font-size:11px;font-weight:500;letter-spacing:.06em;">Get Started</div>' +
      '</div>' +

      // === FEATURES: Editorial with accent line ===
      '<div style="padding:20px 32px 60px;">' +
        '<div style="font-size:9px;text-transform:uppercase;letter-spacing:.3em;color:' + p.accent + ';margin-bottom:24px;text-align:center;">Core Capabilities</div>' +
        '<h2 style="font-family:Georgia,\'Times New Roman\',serif;font-size:34px;font-weight:400;font-style:italic;text-align:center;color:#fff;margin-bottom:40px;">' +
          'Pro features. Zero complexity.</h2>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(255,255,255,.06);border-radius:12px;overflow:hidden;">' +
          featureCell(p, u, 'Designed to convert', 'Every detail is optimized for psychological impact. We deploy validated high-conversion design frameworks that work.', 0) +
          featureCell(p, u, 'Motion that matters', 'Choreographed entrance animations, scroll-triggered reveals, and micro-interactions that keep visitors engaged.', 1) +
          featureCell(p, u, 'Brand coherence', 'AI analyzes your brand DNA and ensures every page, color, and word stays true to your identity.', 2) +
          featureCell(p, u, 'Precision performance', 'Sub-second load times, optimized assets, and CDN delivery. Your site scores 95+ on every benchmark.', 3) +
        '</div>' +
      '</div>' +

      // === SHOWCASE: Overlapping images ===
      '<div style="padding:60px 32px;position:relative;">' +
        '<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:20px;align-items:center;">' +
          '<div style="animation:' + u + 'f 1s ease-out both;">' +
            '<div style="font-size:9px;text-transform:uppercase;letter-spacing:.3em;color:' + p.accent + ';margin-bottom:14px;">Showcase</div>' +
            '<h2 style="font-family:Georgia,\'Times New Roman\',serif;font-size:30px;font-weight:400;line-height:1.15;color:#fff;margin-bottom:14px;">' +
              '<em style="font-style:italic;">The difference<br>is everything.</em></h2>' +
            '<p style="font-size:12px;color:rgba(255,255,255,.35);line-height:1.8;max-width:300px;margin-bottom:20px;">' +
              'We don\'t make cookie-cutter sites. Every project is a custom-crafted digital environment.</p>' +
          '</div>' +
          '<div style="position:relative;">' +
            '<div style="border-radius:12px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.4);animation:' + u + 'fl 7s ease-in-out infinite;">' +
              '<img src="' + p.secondary + '" style="width:100%;height:200px;object-fit:cover;display:block;animation:' + u + 'breathe 10s ease-in-out infinite 2s;" alt="">' +
            '</div>' +
            '<div style="position:absolute;bottom:-20px;left:-16px;width:120px;height:90px;border-radius:8px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.5);border:2px solid ' + p.dark + ';animation:' + u + 'fl 7s ease-in-out infinite 1s;">' +
              '<img src="' + p.tertiary + '" style="width:100%;height:100%;object-fit:cover;display:block;animation:' + u + 'breathe 12s ease-in-out infinite 4s;" alt="">' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // === METRICS ===
      '<div style="padding:40px 32px;display:grid;grid-template-columns:repeat(4,1fr);gap:16px;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06);">' +
        metricItem(p, '340%', 'Avg. Conversion Lift') +
        metricItem(p, '0.8s', 'Avg. Load Time') +
        metricItem(p, '2,400+', 'Sites Launched') +
        metricItem(p, '98%', 'Client Satisfaction') +
      '</div>' +

      // === CTA ===
      '<div style="padding:80px 32px;text-align:center;position:relative;overflow:hidden;">' +
        '<div style="position:absolute;top:50%;left:50%;width:400px;height:400px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,' + p.accent + '15,transparent 70%);animation:' + u + 'gl 4s ease-in-out infinite;pointer-events:none;"></div>' +
        '<h2 style="font-family:Georgia,\'Times New Roman\',serif;font-size:38px;font-weight:400;line-height:1.1;color:#fff;margin-bottom:16px;position:relative;">' +
          'Your next site<br>starts <em style="font-style:italic;color:' + p.accent + ';">here.</em></h2>' +
        '<p style="font-size:12px;color:rgba(255,255,255,.3);margin-bottom:24px;position:relative;">No templates. No compromise. Just your vision, amplified.</p>' +
        '<div style="display:inline-block;padding:14px 36px;background:' + p.accent + ';color:' + p.dark + ';border-radius:4px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;position:relative;">Start Your Project</div>' +
      '</div>' +

      // === FOOTER ===
      '<div style="padding:24px 32px;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;align-items:center;">' +
        '<div style="font-family:Georgia,serif;font-size:14px;font-style:italic;color:rgba(255,255,255,.3);">' + p.brand + '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,.2);">&copy; 2026. All rights reserved.</div>' +
      '</div>' +

      '</div>';
  }

  function marqueeItems(p, items) {
    return items.map(function(name) {
      return '<span style="font-family:Georgia,serif;font-size:16px;font-style:italic;color:rgba(255,255,255,.15);">' + name + '</span>';
    }).join('');
  }

  function featureCell(p, u, title, desc, i) {
    return '<div style="background:' + p.dark + ';padding:28px;animation:' + u + 'f .8s ease-out ' + (i * .15) + 's both;">' +
      '<h3 style="font-family:Georgia,serif;font-size:16px;font-weight:400;font-style:italic;color:#fff;margin-bottom:8px;">' + title + '</h3>' +
      '<p style="font-size:11px;color:rgba(255,255,255,.3);line-height:1.7;">' + desc + '</p>' +
    '</div>';
  }

  function metricItem(p, value, label) {
    return '<div style="text-align:center;">' +
      '<div style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:' + p.accent + ';margin-bottom:4px;">' + value + '</div>' +
      '<div style="font-size:9px;text-transform:uppercase;letter-spacing:.15em;color:rgba(255,255,255,.25);">' + label + '</div>' +
    '</div>';
  }

  // ===== OPTION B: Warm editorial light with bold imagery =====
  function renderOptionB() {
    var p = P(), u = 'ob' + Date.now();
    var desc = state.prompt ? state.prompt.substring(0, 100) : 'Websites that feel like environments. Immersive. Alive. Uniquely yours.';

    return '<style>@keyframes ' + u + 'r{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}' +
      '@keyframes ' + u + 'sc{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}' +
      '@keyframes ' + u + 'dr{0%,100%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(6px,-8px) rotate(1deg)}66%{transform:translate(-4px,6px) rotate(-1deg)}}' +
      '@keyframes ' + u + 'ex{from{width:0}to{width:60px}}' +
      '@keyframes ' + u + 'breathe{0%,100%{filter:brightness(.95) saturate(1.05);transform:scale(1)}50%{filter:brightness(1.08) saturate(1.2);transform:scale(1.02)}}' +
      '@keyframes ' + u + 'slowpan{0%,100%{transform:scale(1.04) translate(0,0)}50%{transform:scale(1.06) translate(-1.5%,-1%)}}' +
      '@keyframes ' + u + 'warmglow{0%,100%{box-shadow:0 30px 80px rgba(0,0,0,.08)}50%{box-shadow:0 30px 80px ' + p.accent + '15}}' +
      '</style>' +
      '<div style="font-family:Inter,system-ui,sans-serif;background:#faf9f7;color:#1a1a1a;overflow:hidden;">' +

      // === NAV ===
      '<div style="display:flex;justify-content:space-between;align-items:center;padding:20px 32px;">' +
        '<div style="display:flex;align-items:center;gap:10px;">' +
          '<div style="width:8px;height:8px;border-radius:50%;background:' + p.accent + ';"></div>' +
          '<span style="font-size:15px;font-weight:700;letter-spacing:-.01em;">' + p.brand + '</span>' +
        '</div>' +
        '<div style="display:flex;gap:24px;font-size:11px;color:#999;font-weight:500;">' +
          '<span>Process</span><span>Work</span><span>Pricing</span>' +
        '</div>' +
        '<div style="padding:8px 20px;background:#1a1a1a;color:#fff;border-radius:20px;font-size:11px;font-weight:600;">Book a Call</div>' +
      '</div>' +

      // === HERO: Large type with side image ===
      '<div style="padding:60px 32px 40px;display:grid;grid-template-columns:1.3fr 1fr;gap:32px;align-items:center;animation:' + u + 'r .9s ease-out both;">' +
        '<div>' +
          '<div style="display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:20px;border:1px solid #e5e5e5;font-size:10px;color:#888;margin-bottom:18px;">' +
            '<div style="width:6px;height:6px;border-radius:50%;background:#22c55e;"></div> Now accepting projects' +
          '</div>' +
          '<h1 style="font-family:Georgia,\'Times New Roman\',serif;font-size:44px;font-weight:400;line-height:1.05;letter-spacing:-.02em;color:#1a1a1a;margin-bottom:16px;">' +
            'We build digital<br><em style="font-style:italic;color:' + p.accent + ';">worlds</em>, not websites.</h1>' +
          '<p style="font-size:13px;color:#888;line-height:1.8;max-width:340px;margin-bottom:24px;">' + desc + '</p>' +
          '<div style="display:flex;gap:12px;">' +
            '<div style="padding:11px 24px;background:#1a1a1a;color:#fff;border-radius:6px;font-size:11px;font-weight:600;">Start a Project</div>' +
            '<div style="padding:11px 24px;border:1.5px solid #ddd;color:#666;border-radius:6px;font-size:11px;font-weight:500;">View Portfolio</div>' +
          '</div>' +
        '</div>' +
        '<div style="position:relative;">' +
          '<div style="border-radius:16px;overflow:hidden;animation:' + u + 'sc .8s ease-out .3s both, ' + u + 'warmglow 8s ease-in-out infinite 1s;">' +
            '<img src="' + p.hero + '" style="width:100%;height:280px;object-fit:cover;display:block;animation:' + u + 'breathe 8s ease-in-out infinite, ' + u + 'slowpan 20s ease-in-out infinite;" alt="">' +
          '</div>' +
          '<div style="position:absolute;bottom:-16px;right:-12px;padding:14px 18px;background:#fff;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.06);animation:' + u + 'dr 6s ease-in-out infinite;">' +
            '<div style="font-size:20px;font-weight:800;color:' + p.accent + ';">4.9</div>' +
            '<div style="font-size:9px;color:#aaa;margin-top:2px;">Client Rating</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // === LOGOS ===
      '<div style="padding:28px 32px;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0;display:flex;justify-content:center;gap:40px;align-items:center;">' +
        '<span style="font-size:9px;text-transform:uppercase;letter-spacing:.2em;color:#ccc;">Trusted by</span>' +
        '<span style="font-family:Georgia,serif;font-size:15px;font-style:italic;color:#ccc;">Stripe</span>' +
        '<span style="font-family:Georgia,serif;font-size:15px;font-style:italic;color:#ccc;">Notion</span>' +
        '<span style="font-family:Georgia,serif;font-size:15px;font-style:italic;color:#ccc;">Linear</span>' +
        '<span style="font-family:Georgia,serif;font-size:15px;font-style:italic;color:#ccc;">Vercel</span>' +
      '</div>' +

      // === PROCESS: Numbered editorial ===
      '<div style="padding:60px 32px;">' +
        '<div style="text-align:center;margin-bottom:40px;animation:' + u + 'r .8s ease-out .4s both;">' +
          '<div style="font-size:9px;text-transform:uppercase;letter-spacing:.3em;color:' + p.accent + ';margin-bottom:12px;">Our Process</div>' +
          '<h2 style="font-family:Georgia,\'Times New Roman\',serif;font-size:32px;font-weight:400;font-style:italic;color:#1a1a1a;">' +
            'Three acts. One masterpiece.</h2>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">' +
          processStep(p, u, '01', 'Discover', 'We immerse ourselves in your brand. Your vision becomes our blueprint.', '.5s') +
          processStep(p, u, '02', 'Craft', 'AI and human creativity merge. Every pixel, every motion, every word — intentional.', '.65s') +
          processStep(p, u, '03', 'Launch', 'Your site goes live with animations, analytics, and a custom domain. Ready to convert.', '.8s') +
        '</div>' +
      '</div>' +

      // === SHOWCASE: Two stacked images ===
      '<div style="padding:40px 32px 60px;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +
          '<div style="border-radius:14px;overflow:hidden;animation:' + u + 'sc .7s ease-out .6s both, ' + u + 'warmglow 9s ease-in-out infinite 2s;">' +
            '<img src="' + p.secondary + '" style="width:100%;height:200px;object-fit:cover;display:block;animation:' + u + 'breathe 10s ease-in-out infinite 1s, ' + u + 'slowpan 22s ease-in-out infinite;" alt="">' +
            '<div style="padding:16px;background:#fff;">' +
              '<strong style="font-size:13px;color:#1a1a1a;">Simplify Your Workflow</strong>' +
              '<p style="font-size:10px;color:#aaa;margin-top:4px;">Dashboard concept for SaaS platform</p>' +
            '</div>' +
          '</div>' +
          '<div style="border-radius:14px;overflow:hidden;animation:' + u + 'sc .7s ease-out .75s both, ' + u + 'warmglow 11s ease-in-out infinite 4s;margin-top:30px;">' +
            '<img src="' + p.tertiary + '" style="width:100%;height:200px;object-fit:cover;display:block;animation:' + u + 'breathe 12s ease-in-out infinite 3s, ' + u + 'slowpan 25s ease-in-out infinite 2s;" alt="">' +
            '<div style="padding:16px;background:#fff;">' +
              '<strong style="font-size:13px;color:#1a1a1a;">Precision Performance</strong>' +
              '<p style="font-size:10px;color:#aaa;margin-top:4px;">Marketing site with 98 Lighthouse score</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // === TESTIMONIAL: Large quote ===
      '<div style="padding:60px 32px;background:#f3f2ef;text-align:center;animation:' + u + 'r .8s ease-out .7s both;">' +
        '<div style="font-family:Georgia,serif;font-size:48px;color:' + p.accent + ';opacity:.3;margin-bottom:8px;">&ldquo;</div>' +
        '<p style="font-family:Georgia,serif;font-size:20px;font-style:italic;line-height:1.6;color:#333;max-width:440px;margin:0 auto 20px;">' +
          'This team doesn\'t build websites. They build worlds you want to live in.</p>' +
        '<strong style="font-size:12px;color:#1a1a1a;">Elena Marchetti</strong>' +
        '<div style="font-size:10px;color:#aaa;margin-top:4px;">Chief Creative Officer, Meridian Group</div>' +
      '</div>' +

      // === CTA ===
      '<div style="padding:80px 32px;text-align:center;background:#1a1a1a;position:relative;overflow:hidden;">' +
        '<div style="position:absolute;top:-100px;left:50%;width:300px;height:300px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,' + p.accent + '18,transparent 70%);pointer-events:none;"></div>' +
        '<h2 style="font-family:Georgia,\'Times New Roman\',serif;font-size:36px;font-weight:400;line-height:1.1;color:#fff;margin-bottom:14px;position:relative;">' +
          'Let\'s create your<br><em style="font-style:italic;color:' + p.accent + ';">next chapter.</em></h2>' +
        '<p style="font-size:12px;color:rgba(255,255,255,.35);margin-bottom:24px;position:relative;">Bespoke digital experiences. Starting at $0.</p>' +
        '<div style="display:inline-block;padding:14px 36px;background:' + p.accent + ';color:#1a1a1a;border-radius:6px;font-size:12px;font-weight:700;position:relative;">Start Your Project</div>' +
      '</div>' +

      // === FOOTER ===
      '<div style="padding:20px 32px;background:#1a1a1a;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;align-items:center;">' +
        '<div style="font-size:12px;color:rgba(255,255,255,.2);">' + p.brand + ' Studio</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,.15);">&copy; 2026</div>' +
      '</div>' +

      '</div>';
  }

  function processStep(p, u, num, title, desc, delay) {
    return '<div style="padding:24px;border:1px solid #eee;border-radius:12px;background:#fff;animation:' + u + 'sc .6s ease-out ' + delay + ' both;">' +
      '<div style="font-family:Georgia,serif;font-size:32px;font-weight:400;color:' + p.accent + ';opacity:.25;margin-bottom:10px;">' + num + '</div>' +
      '<div style="width:60px;height:2px;background:' + p.accent + ';border-radius:1px;margin-bottom:12px;animation:' + u + 'ex .6s ease-out ' + delay + ' both;"></div>' +
      '<h3 style="font-size:15px;font-weight:600;color:#1a1a1a;margin-bottom:6px;">' + title + '</h3>' +
      '<p style="font-size:11px;color:#999;line-height:1.6;">' + desc + '</p>' +
    '</div>';
  }

  // ===== RENDER =====
  function renderOptions() {
    document.getElementById('previewA').innerHTML = renderOptionA();
    document.getElementById('previewB').innerHTML = renderOptionB();
  }

  function renderEditor() {
    var html = state.selectedOption === 'A' ? renderOptionA() : renderOptionB();
    document.getElementById('editorPreview').innerHTML = html;
    var list = document.getElementById('sectionList');
    list.innerHTML = '';
    state.sections.forEach(function(name) {
      var item = document.createElement('div');
      item.className = 'section-item';
      item.innerHTML = '<span class="section-item-name">' + name + '</span><span class="section-item-edit">Edit</span>';
      item.addEventListener('click', function() {
        document.getElementById('chatInput').value = 'Update the ' + name + ' section: ';
        document.getElementById('chatInput').focus();
        document.querySelectorAll('.sidebar-tab').forEach(function(t) { t.classList.remove('active'); });
        document.querySelectorAll('.sidebar-panel').forEach(function(p) { p.classList.remove('active'); });
        document.querySelector('[data-tab="chat"]').classList.add('active');
        document.querySelector('[data-panel="chat"]').classList.add('active');
      });
      list.appendChild(item);
    });
  }

  function renderPublish() {
    document.getElementById('publishPreviewContent').innerHTML = state.selectedOption === 'A' ? renderOptionA() : renderOptionB();
  }

});
