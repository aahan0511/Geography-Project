// Theme Toggle Functionality
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const body = document.body;

// Check for saved theme preference or default to dark mode
let currentTheme = localStorage.getItem("theme") || "dark";
applyTheme(currentTheme);

function applyTheme(theme) {
  body.classList.remove("light-mode", "glass-mode");

  if (theme === "light") {
    body.classList.add("light-mode");
    themeIcon.textContent = "🌙";
  } else if (theme === "glass") {
    body.classList.add("glass-mode");
    themeIcon.textContent = "💎";
  } else {
    // Dark mode
    themeIcon.textContent = "☀️";
  }
}

// Toggle theme on button click (Cycle: Dark -> Light -> Glass -> Dark)
themeToggle.addEventListener("click", () => {
  if (body.classList.contains("light-mode")) {
    currentTheme = "glass";
  } else if (body.classList.contains("glass-mode")) {
    currentTheme = "dark";
  } else {
    currentTheme = "light";
  }

  applyTheme(currentTheme);
  localStorage.setItem("theme", currentTheme);
});

// Initialize Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate GSAP
gsap.registerPlugin(ScrollTrigger);

// 1. Hero Animation (Intro)
const heroTl = gsap.timeline();
heroTl
  .from(".mega-title .line", {
    y: 100,
    opacity: 0,
    duration: 1.5,
    stagger: 0.2,
    ease: "power4.out",
  })
  .from(
    ".hero-desc",
    {
      y: 20,
      opacity: 0,
      duration: 1,
    },
    "-=1"
  );

// 2. The "Stacking Cards" Effect
// We select all slides except the last one (or all of them)
const slides = gsap.utils.toArray(".slide");

slides.forEach((slide, i) => {
  slide.style.zIndex = i;

  // Inner Animations (Trigger when the slide becomes active)
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: slide,
      start: "top center",
      toggleActions: "play none none reverse",
    },
  });

  const content = slide.querySelector(".glass-panel");
  const header = slide.querySelector(".slide-header");
  const items = slide.querySelectorAll(
    ".feature-card, .clean-list li, .stat, .quote"
  );

  if (header) {
    tl.from(header, { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" });
  }

  if (items.length > 0) {
    tl.from(
      items,
      {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      },
      "-=0.4"
    );
  }

  // READABILITY FIX: Only blur the immediate previous slide
  // When a slide (i) is fully covered by the next slide (i+1), 
  // we hide the slide BEFORE it (i-1). 
  // This ensures Slide (i+2) only blurs Slide (i+1).
  if (i > 0) {
    const prevSlide = slides[i - 1];
    
    // When the NEXT slide (i+1) starts entering, hide the slide BEFORE this one (i-1)
    if (i < slides.length - 1) {
      const nextSlide = slides[i + 1];
      ScrollTrigger.create({
        trigger: nextSlide,
        start: "top bottom",
        onEnter: () => gsap.to(prevSlide, { opacity: 0, duration: 0.3 }),
        onLeaveBack: () => gsap.to(prevSlide, { opacity: 1, duration: 0.3 }),
      });
    }
  }
});

// Fix for Lenis + ScrollTrigger Pinning
// ScrollTrigger acts on the scroll position. Lenis changes it.
// We typically don't need complex integration if we just use native scroll events (which Lenis emits).
