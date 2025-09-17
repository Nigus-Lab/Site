// ================= DOM CONTENT LOADED =================
document.addEventListener("DOMContentLoaded", function() {
  // ================= Mobile Navigation =================
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
  });
  
  // Close mobile nav when clicking on a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
    });
  });
  
  // ================= Hide Header on Scroll =================
  let lastScrollY = window.scrollY;
  const header = document.querySelector("header");
  const headerHeight = header.offsetHeight;

  window.addEventListener("scroll", () => {
    const currentY = window.scrollY;
    
    if (currentY > lastScrollY && currentY > headerHeight) {
      header.classList.add("hide");
    } else {
      header.classList.remove("hide");
    }
    
    lastScrollY = currentY;
  });

  // ================= App Card Expansion =================
  const appCards = document.querySelectorAll('.app-card');

  appCards.forEach(card => {
    card.addEventListener('click', e => {
      e.stopPropagation();
      const expanded = card.classList.contains('expanded');
      appCards.forEach(c => c.classList.remove('expanded'));
      if(!expanded) card.classList.add('expanded');
    });
  });

  document.addEventListener('click', () => {
    appCards.forEach(c => c.classList.remove('expanded'));
  });

  // ================= Scroll Reveal Animation =================
  const faders = document.querySelectorAll('.fade-in');
  const slideBounce = document.querySelectorAll('.slide-bounce');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  faders.forEach(f => observer.observe(f));
  slideBounce.forEach(f => observer.observe(f));

  // Initialize all components
  initSlideshows();
  initTextEffect();
  initEnhancedNavigation();
  initRippleEffect();
});

// ================= TEXT ANIMATION EFFECT =================
function initTextEffect() {
  const heroText = document.querySelector('.hero-text');
  if (!heroText) return;

  let isNigus = true;
  const changeInterval = 4000; // change every 4 seconds

  function toggleText() {
    isNigus = !isNigus;
    const text = isNigus ? 'Nigus' : 'ንጉስ';
    
    // Create a smooth transition effect
    heroText.style.opacity = '0';
    
    setTimeout(() => {
      heroText.textContent = text;
      heroText.setAttribute('data-text', text);
      heroText.style.opacity = '1';
    }, 500);
  }

  // Start interval
  setInterval(toggleText, changeInterval);
}

// ================= ENHANCED NAVIGATION EFFECTS =================
function initEnhancedNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.transform = '';
    });
  });
}

// ================= RIPPLE EFFECT =================
function initRippleEffect() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const x = e.clientX - this.getBoundingClientRect().left;
      const y = e.clientY - this.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// ================= SLIDESHOW FUNCTIONALITY =================
function initSlideshows() {
  const slideshows = document.querySelectorAll('.fade-slideshow');
  
  slideshows.forEach(slideshow => {
    const slides = slideshow.querySelectorAll('.slide');
    const dotsContainer = slideshow.nextElementSibling;
    let currentSlide = 0;
    
    // Create dots
    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.dataset.index = i;
      dotsContainer.appendChild(dot);
    }
    
    const dots = dotsContainer.querySelectorAll('.dot');
    
    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      currentSlide = index;
    }
    
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index);
        showSlide(index);
        resetTimer();
      });
    });
    
    function nextSlide() {
      let next = currentSlide + 1;
      if (next >= slides.length) next = 0;
      showSlide(next);
    }
    
    let slideInterval = setInterval(nextSlide, 4000);
    
    function resetTimer() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 4000);
    }
    
    slideshow.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slideshow.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 4000));
  });
}

// ================= PARTICLE BACKGROUND =================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: null, y: null };
let pending = false;
let scrollOffset = 0;

window.addEventListener('mousemove', e => {
  if(pending) return;
  pending = true;
  requestAnimationFrame(() => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    pending = false;
  });
});

window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
window.addEventListener('scroll', () => { scrollOffset = window.scrollY; });

let particleCount = window.innerWidth < 600 ? 40 : 100;
let particles = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = 0;
    this.speedY = 0;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 10) + 5;
  }
  
  update() {
    if(mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const forceDirectionX = dx / dist;
      const forceDirectionY = dy / dist;
      const maxDistance = 100;
      const force = (maxDistance - dist) / maxDistance;
      
      if(dist < maxDistance){
        this.speedX += forceDirectionX * force * this.density * 0.01;
        this.speedY += forceDirectionY * force * this.density * 0.01;
      }
    }
    
    this.speedX += (this.baseX - this.x) * 0.002;
    this.speedY += (this.baseY - this.y) * 0.002;

    this.x += this.speedX;
    this.y += this.speedY + scrollOffset * 0.002;

    this.speedX *= 0.92;
    this.speedY *= 0.92;

    this.x = Math.max(0, Math.min(canvas.width, this.x));
    this.y = Math.max(0, Math.min(canvas.height, this.y));
  }
  
  draw() {
    ctx.fillStyle = 'rgba(0,192,255,0.9)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for(let i=0; i<particleCount; i++){
    particles.push(new Particle());
  }
}

let fps = window.innerWidth < 600 ? 30 : 60;
let interval = 1000 / fps;
let lastTime = Date.now();

function animateParticles() {
  requestAnimationFrame(animateParticles);
  const now = Date.now();
  const delta = now - lastTime;
  if(delta < interval) return;
  lastTime = now;

  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => { p.update(); p.draw(); });
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particleCount = window.innerWidth < 600 ? 40 : 100;
  initParticles();
});

// ================= ANIMATED GRID LINES =================
const gridCanvas = document.createElement('canvas');
gridCanvas.id = 'grid-canvas';
const gridCtx = gridCanvas.getContext('2d');

function resizeGrid() {
  gridCanvas.width = window.innerWidth;
  gridCanvas.height = window.innerHeight;
}

resizeGrid();
document.body.appendChild(gridCanvas);

function drawGrid() {
  gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
  const step = 100;
  gridCtx.strokeStyle = 'rgba(0,192,255,0.1)';
  gridCtx.lineWidth = 1;

  for(let x = 0; x < gridCanvas.width; x += step) {
    gridCtx.beginPath();
    gridCtx.moveTo(x, 0);
    gridCtx.lineTo(x, gridCanvas.height);
    gridCtx.stroke();
  }

  for(let y = 0; y < gridCanvas.height; y += step) {
    gridCtx.beginPath();
    gridCtx.moveTo(0, y);
    gridCtx.lineTo(gridCanvas.width, y);
    gridCtx.stroke();
  }

  requestAnimationFrame(drawGrid);
}

drawGrid();

window.addEventListener('resize', resizeGrid);

// ================= RANDOM GLITCH EFFECT =================
setInterval(() => {
  const glitchTexts = document.querySelectorAll('.glitch-text');
  glitchTexts.forEach(text => {
    if (Math.random() > 0.95) {
      text.style.animation = 'none';
      setTimeout(() => {
        text.style.animation = '';
      }, 200);
    }
  });
}, 3000);