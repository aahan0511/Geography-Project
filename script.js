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

  ScrollTrigger.create({
    trigger: slide,
    start: "top top",
    pin: true,
    pinSpacing: false, // This causes the next section to scroll OVER this pinned one
    end: "bottom top", // Pin lasts until the bottom of the element hits the top? No, that clears it immediately.
    // Actually we want it pinned until the user has viewed it enough.
    // For a full stack effect where the next section covers the current one:
    // We need the 'end' to be essentially "+=100%" (the window height).
    // But since we are pinSpacing: false, the next section is *already* under it?
    // No, `pinSpacing: false` means the space needed for the pin is removed, so the next section flows up immediately.
    // But since we want them to be full screen, the next section is simply below.

    // Let's rely on z-index automatically handling stacking if we defined it?
    // style.css needs z-indexes?
    // Actually, let's keep it simple:
    // Standard "Sticky" CSS is the easiest way to do card stacking without complex GSAP logic.
    // Let's switch logic to CSS Sticky for the container?
  });

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

  // Animate the glass panel popping up or fading in?
  // Actually it's already there. Let's just animate the contents.

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
});

// Since we are using GSAP Pinning with pinSpacing: false, let's explicitely set z-indices to ensure correct stacking order
slides.forEach((slide, i) => {
  slide.style.zIndex = i;
});

// Fix for Lenis + ScrollTrigger Pinning
// ScrollTrigger acts on the scroll position. Lenis changes it.
// We typically don't need complex integration if we just use native scroll events (which Lenis emits).
