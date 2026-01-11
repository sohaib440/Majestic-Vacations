'use client'

import { useEffect, useRef, createElement } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ShuffleTextProps {
  text: string
  className?: string
  duration?: number
  stagger?: number
  shuffleDirection?: 'left' | 'right'
  loop?: boolean
  loopDelay?: number
  triggerOnHover?: boolean
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
}

export default function ShuffleText({
  text,
  className = '',
  duration = 0.35,
  stagger = 0.03,
  shuffleDirection = 'right',
  loop = false,
  loopDelay = 0,
  triggerOnHover = true,
  tag = 'p',
}: ShuffleTextProps) {
  const containerRef = useRef<HTMLElement>(null)
  const charsRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[]
    if (chars.length === 0) return

    const animate = () => {
      chars.forEach((char, i) => {
        const delay = i * stagger
        const direction = shuffleDirection === 'right' ? 100 : -100

        gsap.fromTo(
          char,
          {
            y: direction,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration,
            delay,
            ease: 'power3.out',
          }
        )
      })
    }

    // Initial animation
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 80%',
      onEnter: animate,
      once: true,
    })

    // Hover replay
    const handleMouseEnter = () => {
      if (triggerOnHover) {
        animate()
      }
    }

    if (triggerOnHover && containerRef.current) {
      containerRef.current.addEventListener('mouseenter', handleMouseEnter)
    }

    // Loop
    let loopInterval: NodeJS.Timeout | null = null
    if (loop) {
      loopInterval = setInterval(() => {
        animate()
      }, (duration + stagger * chars.length) * 1000 + loopDelay * 1000)
    }

    return () => {
      trigger.kill()
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseenter', handleMouseEnter)
      }
      if (loopInterval) {
        clearInterval(loopInterval)
      }
    }
  }, [text, duration, stagger, shuffleDirection, loop, loopDelay, triggerOnHover])

  return createElement(
    tag,
    {
      ref: containerRef,
      className,
    },
    text.split('').map((char, i) => (
      <span
        key={i}
        ref={(el) => {
          charsRef.current[i] = el
        }}
        style={{ display: 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  )
}

