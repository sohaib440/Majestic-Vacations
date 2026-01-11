"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

interface RotatingTextProps {
  words: string[];
  className?: string;
  duration?: number;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  animationDuration?: number;
}

export default function RotatingText({
  words,
  className = "",
  duration = 2,
  tag = "span",
  animationDuration = 0.5,
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (words.length === 0) return;
    if (!textRef.current) return;

    const rotateWord = () => {
      if (!textRef.current) return;

      // Fade out and slide up current word
      gsap.to(textRef.current, {
        opacity: 0,
        y: -20,
        duration: animationDuration / 2,
        ease: "power2.in",
        onComplete: () => {
          // Change word
          setCurrentIndex((prev) => (prev + 1) % words.length);
          
          // Reset position and fade in new word
          gsap.set(textRef.current, { y: 20, opacity: 0 });
          gsap.to(textRef.current, {
            opacity: 1,
            y: 0,
            duration: animationDuration / 2,
            ease: "power2.out",
          });
        },
      });
    };

    // Start rotation after initial delay
    const startDelay = setTimeout(() => {
      intervalRef.current = setInterval(rotateWord, duration * 1000);
    }, duration * 1000);

    return () => {
      clearTimeout(startDelay);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [words.length, duration, animationDuration]);

  const Tag = tag as keyof JSX.IntrinsicElements;

  return (
    <Tag className={className}>
      <span
        ref={textRef}
        className=""
        style={{ opacity: 1 }}
      >
        {words[currentIndex]}
      </span>
    </Tag>
  );
}
