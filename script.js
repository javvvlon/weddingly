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

  const openEnvelope = () => {
    if (opened) return;
    opened = true;

    // Start music on this real user gesture
    const music = document.getElementById('bgMusic');
    if (music) {
      music.muted = false;
      music.play().catch(() => {});
    }

    const shards = preloader.querySelectorAll('.wax-shard');
    const particles = preloader.querySelectorAll('.dust-particle');

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        preloader.classList.add('loaded');
        animateHero();
      }
    });

    // Stage 1 — pre-break pulse + flash
    tl.to('.wax-core', {
      scale: 1.12,
      duration: 0.22,
      ease: 'back.out(2)'
    })
    .to('.wax-core', {
      filter: 'brightness(1.7)',
      duration: 0.09,
      yoyo: true,
      repeat: 1
    }, '<')

    // Stage 2 — shards fly outward
    .set(shards, { opacity: 1 }, 0.25)
    .to(shards, {
      x: () => gsap.utils.random(-220, 220),
      y: () => gsap.utils.random(-180, 180),
      rotation: () => `+=${gsap.utils.random(-260, 260)}`,
      scale: () => gsap.utils.random(0.7, 1.4),
      duration: 1.1,
      ease: 'power3.out',
      stagger: { each: 0.015, from: 'random' }
    }, 0.28)
    .to(shards, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in'
    }, 0.9)

    // Stage 2b — seal core disappears (scales to 0)
    .to('.wax-core', {
      scale: 0,
      opacity: 0,
      rotate: -20,
      duration: 0.5,
      ease: 'power2.in'
    }, 0.3)

    // Stage 3 — gold dust burst outward
    .to(particles, {
      x: () => gsap.utils.random(-220, 220),
      y: () => gsap.utils.random(-180, 180),
      opacity: 1,
      scale: () => gsap.utils.random(0.8, 2.2),
      duration: 1.0,
      ease: 'power2.out',
      stagger: { each: 0.008, from: 'random' }
    }, 0.32)
    .to(particles, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in'
    }, 1.0)

    // Stage 4 — envelope halves split apart, letter rises
    .add(() => preloader.classList.add('opening'), 0.45)

    // Stage 5 — pause briefly on the revealed letter, then zoom into camera
    .add(() => preloader.classList.add('zooming'), 2.4)
    .to(preloader, {
      opacity: 0,
      duration: 1.0,
      ease: 'power2.inOut'
    }, 3.0);
  };

  if (waxSeal) waxSeal.addEventListener('click', openEnvelope);
  if (envelope) envelope.addEventListener('click', openEnvelope);

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
