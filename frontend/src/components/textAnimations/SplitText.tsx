"use client";

import { useEffect, useRef, createElement } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  direction?: "up" | "down" | "left" | "right";
}

export default function SplitText({
  text,
  className = "",
  delay = 0,
  duration = 0.6,
  stagger = 0.05,
  tag = "p",
  direction = "up",
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[];
    if (chars.length === 0) return;

    const directions = {
      up: { y: 50, x: 0 },
      down: { y: -50, x: 0 },
      left: { y: 0, x: 50 },
      right: { y: 0, x: -50 },
    };

    const { y, x } = directions[direction];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    chars.forEach((char, i) => {
      tl.fromTo(
        char,
        {
          opacity: 0,
          y,
          x,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration,
          delay: delay + i * stagger,
          ease: "power3.out",
        },
        i === 0 ? 0 : "<"
      );
    });
  }, [text, delay, duration, stagger, direction]);

  return createElement(
    tag,
    {
      ref: containerRef,
      className,
    },
    text.split("").map((char, i) => (
      <span
        key={i}
        ref={(el) => {
          charsRef.current[i] = el;
        }}
        style={{ display: "inline-block" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ))
  );
}
