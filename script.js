/* ============================================
   WEDDING INVITATION — SCRIPTS
   GSAP animations, countdown, particles
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ========== ENVELOPE LOADER ==========
  const preloader = document.getElementById('preloader');
  const waxSeal = document.getElementById('waxSeal');
  const envelope = document.getElementById('envelope');
  const dustBurst = document.getElementById('dustBurst');
  let opened = false;

  // Pre-spawn gold dust particles inside the burst container
  if (dustBurst) {
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('span');
      p.className = 'dust-particle';
      dustBurst.appendChild(p);
    }
  }

  // Spawn extra heart confetti inside the seal for a fuller burst
  const sealEl = document.getElementById('waxSeal');
  if (sealEl) {
    const EXTRA_HEARTS = 24;
    for (let i = 0; i < EXTRA_HEARTS; i++) {
      const h = document.createElement('div');
      h.className = 'wax-shard';
      h.style.setProperty('--a', `${(360 / EXTRA_HEARTS) * i}deg`);
      sealEl.appendChild(h);
    }
  }

  const openEnvelope = () => {
    if (opened) return;
    opened = true;

    // Start music on this real user gesture
    const music = document.getElementById('bgMusic');
    if (music) {
      music.muted = false;
      music.play().catch(() => {});
    }

    const seal = document.getElementById('waxSeal');
    const shards = preloader.querySelectorAll('.wax-shard');
    const particles = preloader.querySelectorAll('.dust-particle');
    const ripples = preloader.querySelectorAll('.wax-ripple');
    const hint = document.getElementById('envelopeHint');

    // Radial (circular) distribution helpers
    const SHARD_RADIUS = 360;
    const DUST_RADIUS = 440;
    const shardCount = shards.length;
    const particleCount = particles.length;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        preloader.classList.add('loaded');
        animateHero();
      }
    });

    // Stage 0 — hide hint
    tl.to(hint, { opacity: 0, duration: 0.3 }, 0)

    // Stage 1 — ripple rings expand outward from the seal
    .to(ripples, {
      scale: 3.2,
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
      stagger: 0.18,
      keyframes: [
        { scale: 0.85, opacity: 0, duration: 0 },
        { opacity: 0.9, duration: 0.1 },
        { scale: 3.2, opacity: 0, duration: 1.1, ease: 'power2.out' }
      ]
    }, 0)

    // Stage 1b — core pulses in sync with ripple
    .to('.wax-core', {
      scale: 1.15,
      duration: 0.35,
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut'
    }, 0)

    // Stage 2 — hearts burst outward in a circle with varied sizes
    .set(shards, {
      opacity: 1,
      scale: () => gsap.utils.random(0.5, 1.8)
    }, 0.55)
    .to(shards, {
      x: (i) => Math.cos((i / shardCount) * Math.PI * 2 - Math.PI / 2) * gsap.utils.random(SHARD_RADIUS * 0.6, SHARD_RADIUS * 1.1),
      y: (i) => Math.sin((i / shardCount) * Math.PI * 2 - Math.PI / 2) * gsap.utils.random(SHARD_RADIUS * 0.6, SHARD_RADIUS * 1.1),
      rotation: () => gsap.utils.random(-90, 90),
      duration: 0.9,
      ease: 'power3.out'
    }, 0.55)
    // Stage 2b — gravity drop: hearts fall down off-screen with wobble
    .to(shards, {
      y: '+=' + (window.innerHeight + 400),
      x: () => '+=' + gsap.utils.random(-80, 80),
      rotation: () => '+=' + gsap.utils.random(120, 360),
      duration: 1.8,
      ease: 'power2.in',
      stagger: { each: 0.015, from: 'random' }
    }, 1.35)
    .to(shards, {
      opacity: 0,
      duration: 0.6,
      ease: 'power1.in'
    }, 2.6)

    // Stage 2b — core fades out after the burst
    .to('.wax-core', {
      opacity: 0,
      scale: 0.7,
      duration: 0.35,
      ease: 'power2.in'
    }, 0.58)

    // Stage 3 — gold dust also in a radial ring (slightly larger)
    .to(particles, {
      x: (i) => Math.cos((i / particleCount) * Math.PI * 2) * DUST_RADIUS,
      y: (i) => Math.sin((i / particleCount) * Math.PI * 2) * DUST_RADIUS,
      opacity: 1,
      scale: 1.6,
      duration: 1.15,
      ease: 'power2.out'
    }, 0.6)
    .to(particles, {
      opacity: 0,
      duration: 0.55,
      ease: 'power2.in'
    }, 1.4)

    // Stage 4a — seal rises straight up (ease out)
    .set(seal, { transformOrigin: '50% 50%', x: 0 })
    .to(seal, {
      y: -120,
      duration: 0.55,
      ease: 'power2.out'
    }, 1.0)

    // Stage 4b — then drops straight down with gravity
    .to(seal, {
      y: () => window.innerHeight + 200,
      duration: 1.3,
      ease: 'power3.in'
    }, 1.55)

    // Stage 5 — submerge: preloader blurs/scales up while hero rises underneath
    .to(preloader, {
      opacity: 0,
      scale: 1.15,
      filter: 'blur(14px)',
      duration: 1.4,
      ease: 'power2.inOut'
    }, 3.0)
    .fromTo('#hero', {
      opacity: 0,
      scale: 1.08,
      filter: 'blur(10px)'
    }, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1.4,
      ease: 'power2.out'
    }, 3.1);
  };

  if (waxSeal) waxSeal.addEventListener('click', openEnvelope);

  // ========== HERO ANIMATION ==========
  gsap.set('.hero-invite', { y: 20, opacity: 0 });
  gsap.set('.name-groom', { y: 40, opacity: 0 });
  gsap.set('.hero-amp', { scale: 0.5, opacity: 0 });
  gsap.set('.name-bride', { y: 40, opacity: 0 });
  gsap.set('.hero-request', { y: 20, opacity: 0 });
  gsap.set('.hero-date', { y: 20, opacity: 0 });
  gsap.set('.hero-venue', { y: 20, opacity: 0 });
  gsap.set('.corner-ornament', { opacity: 0 });
  gsap.set('.scroll-indicator', { opacity: 0 });

  function animateHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-invite', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.2
    })
    .to('.name-groom', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power4.out'
    }, '-=0.5')
    .to('.hero-amp', {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.6')
    .to('.name-bride', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power4.out'
    }, '-=0.6')
    .to('.hero-request', {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, '-=0.4')
    .to('.hero-date', {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, '-=0.4')
    .to('.hero-venue', {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, '-=0.4')
    .to('.corner-ornament', {
      opacity: 1,
      duration: 1,
      stagger: 0.1
    }, '-=0.6')
    .to('.scroll-indicator', {
      opacity: 1,
      duration: 0.8
    }, '-=0.3');
  }

  // ========== NAVBAR ==========
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // ========== HERO PARALLAX ==========
  const heroBg = document.querySelector('.hero-bg-image');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 15,
      scale: 1.1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.to(heroContent, {
      y: -60,
      opacity: 0,
      scale: 0.95,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '60% top',
        scrub: 1
      }
    });
  }

  // ========== PARALLAX PHOTO DIVIDERS ==========
  document.querySelectorAll('.parallax-img').forEach(img => {
    gsap.to(img, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: img.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  });

  // ========== CSS FADE-IN ON SCROLL ==========
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.gallery-item, .event-card, .section-header').forEach(el => {
    observer.observe(el);
  });

  // ========== COUNTDOWN TIMER ==========
  const weddingDate = new Date('2026-04-24T18:30:00+05:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      document.getElementById('days').textContent = '0';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      document.querySelector('.countdown-message').textContent = 'The celebration has begun!';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString();
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ========== BACKGROUND MUSIC ==========
  const music = document.getElementById('bgMusic');
  const musicBtn = document.getElementById('musicToggle');
  const iconMusic = musicBtn.querySelector('.icon-music');
  const iconMuted = musicBtn.querySelector('.icon-muted');
  let musicPlaying = false;

  if (music) music.volume = 0.4;

  function setPlaying(on) {
    musicPlaying = on;
    musicBtn.classList.toggle('playing', on);
    iconMusic.style.display = on ? '' : 'none';
    iconMuted.style.display = on ? 'none' : '';
  }

  // Playback is started by the envelope-open click (real user gesture).
  // Reflect play/pause state on the music button icon.
  music.addEventListener('play', () => setPlaying(true));
  music.addEventListener('pause', () => setPlaying(false));
  setPlaying(false);

  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!music.paused) {
      music.pause();
      setPlaying(false);
    } else {
      music.play().then(() => setPlaying(true)).catch(() => {});
    }
  });

  // ========== SMOOTH SCROLL FOR NAV LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
});
