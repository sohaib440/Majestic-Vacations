'use client'

import { ReactNode } from 'react'

interface ShinyTextProps {
  children: ReactNode
  className?: string
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  variant?: 'light' | 'dark' // light = for dark backgrounds, dark = for light backgrounds
}

export default function ShinyText({
  children,
  className = '',
  tag = 'span',
  variant = 'light',
}: ShinyTextProps) {
  const Tag = tag as keyof JSX.IntrinsicElements

  return (
    <>
      <style jsx global>{`
        @keyframes shiny {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .shiny-text-light {
          background: linear-gradient(120deg, transparent 0%, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%, transparent 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shiny 3s infinite;
        }
        .shiny-text-dark {
          position: relative;
          display: inline-block;
        }
        .shiny-text-dark-wrapper {
          position: relative;
          display: inline-block;
        }
        .shiny-text-dark-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(120deg, 
            transparent 0%, 
            transparent 40%, 
            rgba(255,255,255,0.6) 50%, 
            transparent 60%, 
            transparent 100%);
          background-size: 200% 100%;
          mix-blend-mode: overlay;
          animation: shiny 3s infinite;
          pointer-events: none;
        }
      `}</style>
      {variant === 'dark' ? (
        <span className="shiny-text-dark-wrapper">
          <Tag 
            className={`shiny-text-dark ${className}`}
          >
            {children}
          </Tag>
        </span>
      ) : (
        <Tag 
          className={`relative inline-block shiny-text-light ${className}`}
        >
          {children}
        </Tag>
      )}
    </>
  )
}

