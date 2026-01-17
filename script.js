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
  // We want the slide to be pinned as we scroll through it
  // But we also want the NEXT slide to cover it.
  // The standard "Layered Pinning" technique:

  // We simply Pin the slide for a duration, while the next one scrolls up?
  // Actually, simply using `pin: true` on each section often results in them stacking
  // if `pinSpacing: false` is used.

    // CSS Sticky handles the pinning. We just trigger animations.
  });

  // Scale down the CURRENT slide as the NEXT slide enters
  if (i < slides.length - 1) {
    const nextSlide = slides[i + 1];
    gsap.to(slide, {
        scale: 0.85,
        opacity: 0.5,
        scrollTrigger: {
            trigger: nextSlide,
            start: "top bottom", // when next slide enters from bottom
            end: "top top",      // when next slide fully covers (reaches top)
            scrub: true
        }
    });
  }

  // Inner Animations (Trigger when the slide becomes active)
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: slide, // Keep this triggered by the slide itself
      start: "top center",
      toggleActions: "play none none reverse",
    },
  });

  // ... rest of inner animations ... 
  // (We need to ensure we don't break the existing code structure)
  // Re-selecting logic to insert cleaner:
  
  const header = slide.querySelector(".slide-header");
  const items = slide.querySelectorAll(
    ".feature-card, .clean-list li, .stat, .quote, .mega-title .line, .hero-desc"
  );
  
  if (slide.id !== 'slide-hero') {
      if (header) {
        tl.from(header, { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" });
      }
      if (items.length > 0) {
        tl.from(items, { 
            y: 50, 
            opacity: 0, 
            duration: 0.8, 
            stagger: 0.1, 
            ease: "power2.out" 
        }, "-=0.4");
      }
  }
});

// Z-Index handling
slides.forEach((slide, i) => {
  slide.style.zIndex = i + 1;
});

// Since we use Scale, we need transform-origin to be consistent
// It's handled in CSS or defaults to center. Center is good for the "receding" look.

// Fix for Lenis + ScrollTrigger Pinning
// ScrollTrigger acts on the scroll position. Lenis changes it.
// We typically don't need complex integration if we just use native scroll events (which Lenis emits).
