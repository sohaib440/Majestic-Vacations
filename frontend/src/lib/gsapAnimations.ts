import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Utility function for fade in animation
 */
export const fadeIn = (
  element: gsap.TweenTarget,
  duration: number = 1,
  delay: number = 0
) => {
  return gsap.from(element, {
    opacity: 0,
    y: 50,
    duration,
    delay,
    ease: 'power3.out',
  });
};

/**
 * Utility function for slide in from left
 */
export const slideInLeft = (
  element: gsap.TweenTarget,
  duration: number = 1,
  delay: number = 0
) => {
  return gsap.from(element, {
    opacity: 0,
    x: -100,
    duration,
    delay,
    ease: 'power3.out',
  });
};

/**
 * Utility function for slide in from right
 */
export const slideInRight = (
  element: gsap.TweenTarget,
  duration: number = 1,
  delay: number = 0
) => {
  return gsap.from(element, {
    opacity: 0,
    x: 100,
    duration,
    delay,
    ease: 'power3.out',
  });
};

/**
 * Utility function for slide in from top
 */
export const slideInTop = (
  element: gsap.TweenTarget,
  duration: number = 1,
  delay: number = 0
) => {
  return gsap.from(element, {
    opacity: 0,
    y: -100,
    duration,
    delay,
    ease: 'power3.out',
  });
};

/**
 * Utility function for slide in from bottom
 */
export const slideInBottom = (
  element: gsap.TweenTarget,
  duration: number = 1,
  delay: number = 0
) => {
  return gsap.from(element, {
    opacity: 0,
    y: 100,
    duration,
    delay,
    ease: 'power3.out',
  });
};

/**
 * Utility function for scale in animation
 */
export const scaleIn = (
  element: gsap.TweenTarget,
  duration: number = 1,
  delay: number = 0
) => {
  return gsap.from(element, {
    opacity: 0,
    scale: 0.5,
    duration,
    delay,
    ease: 'back.out(1.7)',
  });
};

/**
 * Utility function for stagger animation
 */
export const staggerFadeIn = (
  elements: gsap.TweenTarget,
  staggerDelay: number = 0.15
) => {
  return gsap.from(elements, {
    opacity: 0,
    y: 60,
    duration: 0.8,
    stagger: staggerDelay,
    ease: 'power3.out',
  });
};

/**
 * Create scroll-triggered animation
 */
export const scrollAnimation = (
  element: gsap.TweenTarget,
  animationProps: gsap.TweenVars,
  scrollTriggerConfig?: ScrollTrigger.Vars
) => {
  return gsap.from(element, {
    ...animationProps,
    scrollTrigger: {
      trigger: element as gsap.DOMTarget,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
      ...scrollTriggerConfig,
    },
  });
};

/**
 * Parallax effect
 */
export const parallax = (
  element: gsap.TweenTarget,
  speed: number = 0.5
) => {
  return gsap.to(element, {
    y: -100 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element as gsap.DOMTarget,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

/**
 * Text split and reveal animation
 */
export const textReveal = (
  element: gsap.TweenTarget,
  duration: number = 0.8,
  stagger: number = 0.05
) => {
  const chars = (element as HTMLElement).textContent?.split('');
  if (!chars) return;

  (element as HTMLElement).innerHTML = chars
    .map((char) => `<span class="char" style="display:inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
    .join('');

  return gsap.from(`${element} .char`, {
    opacity: 0,
    y: 50,
    duration,
    stagger,
    ease: 'power3.out',
  });
};

/**
 * Rotate and fade in animation
 */
export const rotateIn = (
  element: gsap.TweenTarget,
  duration: number = 1,
  delay: number = 0
) => {
  return gsap.from(element, {
    opacity: 0,
    rotation: -180,
    duration,
    delay,
    ease: 'back.out(1.7)',
  });
};

/**
 * Counter animation
 */
export const animateCounter = (
  element: HTMLElement,
  start: number,
  end: number,
  duration: number = 2
) => {
  const obj = { value: start };
  return gsap.to(obj, {
    value: end,
    duration,
    ease: 'power1.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toString();
    },
  });
};

