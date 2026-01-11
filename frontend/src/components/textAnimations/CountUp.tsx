'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
  className?: string
  ease?: string
}

export default function CountUp({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
  ease = 'power1.out',
}: CountUpProps) {
  const countRef = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!countRef.current || hasAnimated) return

    const obj = { count: 0 }

    const trigger = ScrollTrigger.create({
      trigger: countRef.current,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(obj, {
          count: end,
          duration,
          ease,
          onUpdate: () => {
            if (countRef.current) {
              const value = obj.count.toFixed(decimals)
              countRef.current.textContent = `${prefix}${value}${suffix}`
            }
          },
        })
        setHasAnimated(true)
      },
      once: true,
    })

    return () => {
      trigger.kill()
    }
  }, [end, duration, suffix, prefix, decimals, ease, hasAnimated])

  return (
    <span ref={countRef} className={className}>
      {prefix}0{suffix}
    </span>
  )
}

