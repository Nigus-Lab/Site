// ================= DOM Content & App Card Expansion =================
document.addEventListener("DOMContentLoaded", function() {
  const appCards = document.querySelectorAll('.app-card');

  // Toggle expansion on click
  appCards.forEach(card => {
    card.addEventListener('click', e => {
      e.stopPropagation();
      const expanded = card.classList.contains('expanded');
      appCards.forEach(c => c.classList.remove('expanded'));
      if(!expanded) card.classList.add('expanded');
    });
  });

  // Close cards when clicking outside
  document.addEventListener('click', () => {
    appCards.forEach(c => c.classList.remove('expanded'));
  });

  // ================= Scroll Reveal =================
  const faders = document.querySelectorAll('.fade-in');
  const slideBounce = document.querySelectorAll('.slide-bounce');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  faders.forEach(f => observer.observe(f));
  slideBounce.forEach(f => observer.observe(f));

  // Initialize slideshows
  initSlideshows();
  
  // Initialize glitch effect
  initGlitchEffect();
  
  // Initialize enhanced navigation
  initEnhancedNavigation();
});

// ================= Glitch Effect =================
function initGlitchEffect() {
  const glitchText = document.querySelector('.glitch-text');
  if (!glitchText) return;
  
  let isNigus = true;
  let lastChange = Date.now();
  const changeInterval = 3000; // Change every 3 seconds
  
  function updateGlitch() {
    const now = Date.now();
    if (now - lastChange >= changeInterval) {
      isNigus = !isNigus;
      glitchText.textContent = isNigus ? 'Nigus' : 'ንጉስ';
      glitchText.setAttribute('data-text', isNigus ? 'Nigus' : 'ንጉስ');
      lastChange = now;
    }
    requestAnimationFrame(updateGlitch);
  }
  
  updateGlitch();
}

// ================= Enhanced Navigation =================
function initEnhancedNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-2px)';
      link.style.boxShadow = '0 4px 8px rgba(0, 192, 255, 0.3)';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.transform = '';
      link.style.boxShadow = '';
    });
  });
}

// ================= Slideshow Functionality =================
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
    
    // Function to show a specific slide
    function showSlide(index) {
      // Hide all slides
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      // Show the selected slide
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      
      currentSlide = index;
    }
    
    // Add click events to dots
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index);
        showSlide(index);
        resetTimer();
      });
    });
    
    // Function to move to next slide
    function nextSlide() {
      let next = currentSlide + 1;
      if (next >= slides.length) next = 0;
      showSlide(next);
    }
    
    // Auto advance slides
    let slideInterval = setInterval(nextSlide, 4000);
    
    // Reset timer on user interaction
    function resetTimer() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 4000);
    }
    
    // Pause on hover
    slideshow.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    slideshow.addEventListener('mouseleave', () => {
      slideInterval = setInterval(nextSlide, 4000);
    });
  });
}

// ================= Particle Background =================
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

// Particle setup
let particleCount = window.innerWidth < 600 ? 400 : 500;
let particles = [];
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 0.25 + 0.5;
    this.speedX = 0;
    this.speedY = 0;
    this.baseX = this.x;
    this.baseY = this.y;
  }
  update() {
    // Mouse attraction
    if(mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distSq = dx*dx + dy*dy;
      const radius = 50;
      if(distSq < radius*radius){
        this.speedX += dx * 0.005;
        this.speedY += dy * 0.005;
      }
    }

    // Random jitter
    this.speedX += (Math.random()-0.5)*0.09;
    this.speedY += (Math.random()-0.5)*0.09;

    // Apply speeds + scroll effect
    this.x += this.speedX;
    this.y += this.speedY + scrollOffset * 0.002;

    // Return to base
    this.speedX += (this.baseX - this.x)*0.002;
    this.speedY += (this.baseY - this.y)*0.002;

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

// FPS control for mobile
let fps = window.innerWidth < 600 ? 30 : 60;
let interval = 1000 / fps;
let lastTime = Date.now();

function animateParticles() {
  requestAnimationFrame(animateParticles);
  const now = Date.now();
  const delta = now - lastTime;
  if(delta < interval) return;
  lastTime = now;

  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => { p.update(); p.draw(); });
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particleCount = window.innerWidth < 600 ? 400 : 1000;
  initParticles();
});

// ================= Animated Grid Lines =================
const gridCanvas = document.createElement('canvas');
gridCanvas.width = window.innerWidth;
gridCanvas.height = window.innerHeight;
gridCanvas.style.position = 'fixed';
gridCanvas.style.top = '0';
gridCanvas.style.left = '0';
gridCanvas.style.pointerEvents = 'none';
gridCanvas.style.zIndex = '0';
document.body.appendChild(gridCanvas);
const gridCtx = gridCanvas.getContext('2d');

function drawGrid() {
  gridCtx.clearRect(0,0,gridCanvas.width, gridCanvas.height);
  const step = 100;
  gridCtx.strokeStyle = 'rgba(0,192,255,0.1)';
  gridCtx.lineWidth = 1;

  for(let x=0; x<gridCanvas.width; x+=step){
    gridCtx.beginPath();
    gridCtx.moveTo(x,0);
    gridCtx.lineTo(x,gridCanvas.height);
    gridCtx.stroke();
  }

  for(let y=0; y<gridCanvas.height; y+=step){
    gridCtx.beginPath();
    gridCtx.moveTo(0,y);
    gridCtx.lineTo(gridCanvas.width,y);
    gridCtx.stroke();
  }

  requestAnimationFrame(drawGrid);
}
drawGrid();
document.addEventListener("DOMContentLoaded", () => {
  /* ========== Hero Glitch Text Transition ========== */
  const glitchText = document.querySelector(".glitch-text");
  const words = ["Future", "Now"];
  let i = 0;

  function swapWord() {
    glitchText.classList.add("glitching");
    setTimeout(() => {
      i = (i + 1) % words.length;
      glitchText.textContent = words[i];
      glitchText.classList.remove("glitching");
    }, 600);
  }
  setInterval(swapWord, 3500);

  /* ========== App Screenshot Slideshow ========== */
  document.querySelectorAll(".fade-slideshow").forEach(slideshow => {
    const slides = slideshow.querySelectorAll(".slide");
    const dots = slideshow.nextElementSibling.querySelectorAll(".dot");
    let idx = 0;

    function showSlide(n) {
      slides.forEach((slide, i) => slide.classList.toggle("active", i === n));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === n));
    }
    function nextSlide() {
      idx = (idx + 1) % slides.length;
      showSlide(idx);
    }
    showSlide(idx);
    setInterval(nextSlide, 4000);
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        idx = i;
        showSlide(i);
      });
    });
  });

  /* ========== Scroll Reveal ========== */
  const revealEls = document.querySelectorAll(".fade-in, .slide-bounce");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));

  /* ========== Nav Glow Ripple Effect ========== */
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = e.offsetX + "px";
      ripple.style.top = e.offsetY + "px";
      link.appendChild(ripple);

      setTimeout(() => ripple.remove(), 700);

      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 60,
          behavior: "smooth"
        });
      }
    });
  });
});
