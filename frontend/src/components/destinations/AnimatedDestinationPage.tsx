'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface AnimatedDestinationPageProps {
  children: React.ReactNode
}

export default function AnimatedDestinationPage({ children }: AnimatedDestinationPageProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Animate hero title
      const heroTitle = containerRef.current?.querySelector('.hero-title')
      const heroSubtitle = containerRef.current?.querySelector('.hero-subtitle')
      
      if (heroTitle) {
        gsap.from(heroTitle, {
          opacity: 0,
          y: 50,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out',
        })
      }

      if (heroSubtitle) {
        gsap.from(heroSubtitle, {
          opacity: 0,
          y: 30,
          duration: 1,
          delay: 0.6,
          ease: 'power3.out',
        })
      }

      // Animate overview section
      const overviewTitle = containerRef.current?.querySelector('.overview-title')
      const overviewText = containerRef.current?.querySelector('.overview-text')

      if (overviewTitle) {
        gsap.from(overviewTitle, {
          opacity: 0,
          x: -50,
          duration: 1,
          scrollTrigger: {
            trigger: overviewTitle,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
      }

      if (overviewText) {
        gsap.from(overviewText, {
          opacity: 0,
          y: 30,
          duration: 1,
          scrollTrigger: {
            trigger: overviewText,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
      }

      // Animate travel info cards
      const travelCards = containerRef.current?.querySelectorAll('.travel-info-card')
      if (travelCards && travelCards.length > 0) {
        gsap.from(travelCards, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: travelCards[0],
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
      }

      // Animate attractions section
      const attractionsTitle = containerRef.current?.querySelector('.attractions-title')
      if (attractionsTitle) {
        gsap.from(attractionsTitle, {
          opacity: 0,
          scale: 0.9,
          duration: 1,
          scrollTrigger: {
            trigger: attractionsTitle,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
      }

      // Animate CTA section
      const ctaSection = containerRef.current?.querySelector('.cta-section')
      if (ctaSection) {
        gsap.from(ctaSection, {
          opacity: 0,
          y: 50,
          scale: 0.95,
          duration: 1,
          scrollTrigger: {
            trigger: ctaSection,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return <div ref={containerRef}>{children}</div>
}

