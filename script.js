/* ============================================
   WEDDING INVITATION — SCRIPTS
   GSAP animations, countdown, particles
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ========== PRELOADER ==========
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    gsap.to(preloader, {
      opacity: 0,
      duration: 0.8,
      delay: 1.5,
      ease: 'power2.inOut',
      onComplete: () => {
        preloader.classList.add('loaded');
        animateHero();
      }
    });
  });

  // Fallback: remove preloader after 4s max
  setTimeout(() => {
    if (!preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
      animateHero();
    }
  }, 4000);

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
  setPlaying(true);

  // Try autoplay (most browsers block it until user interaction)
  const tryPlay = () => music.play().then(() => setPlaying(true)).catch(() => {});
  tryPlay();

  // Start on first user interaction if autoplay was blocked
  const startOnInteract = () => {
    if (!musicPlaying) tryPlay();
    window.removeEventListener('click', startOnInteract);
    window.removeEventListener('touchstart', startOnInteract);
    window.removeEventListener('keydown', startOnInteract);
  };
  window.addEventListener('click', startOnInteract);
  window.addEventListener('touchstart', startOnInteract);
  window.addEventListener('keydown', startOnInteract);

  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (musicPlaying) { music.pause(); setPlaying(false); }
    else { tryPlay(); }
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
