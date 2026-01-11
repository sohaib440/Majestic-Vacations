'use client'

import { useEffect, useState, useRef, createElement } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface TextTypeProps {
  text: string
  className?: string
  speed?: number
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  showCursor?: boolean
}

export default function TextType({
  text,
  className = '',
  speed = 50,
  tag = 'p',
  showCursor = true,
}: TextTypeProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 85%',
      onEnter: () => {
        setIsTyping(true)
        let currentIndex = 0

        const typeInterval = setInterval(() => {
          if (currentIndex < text.length) {
            setDisplayedText(text.slice(0, currentIndex + 1))
            currentIndex++
          } else {
            clearInterval(typeInterval)
            setIsTyping(false)
          }
        }, speed)

        return () => clearInterval(typeInterval)
      },
      once: true,
    })

    return () => {
      trigger.kill()
    }
  }, [text, speed])

  return createElement(
    tag,
    {
      ref: containerRef,
      className,
    },
    displayedText,
    showCursor && isTyping && (
      <span className="animate-pulse">|</span>
    )
  )
}

