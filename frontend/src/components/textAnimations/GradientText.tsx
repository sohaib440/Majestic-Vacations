'use client'

import { ReactNode, useId } from 'react'

interface GradientTextProps {
  children: ReactNode
  className?: string
  gradient?: string
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  variant?: 'default' | 'warm' | 'elegant' | 'subtle'
}

// Theme colors from tailwind.config.ts
const themeColors = {
  theme: '#332822',
  themeLight: '#D4C3B2',
  themeAccent: '#6B5B4F',
  title: '#4E3B31',
  sepia: '#4E3B31',
}

const gradientVariants = {
  default: `linear-gradient(135deg, ${themeColors.theme} 0%, ${themeColors.themeAccent} 100%)`,
  warm: `linear-gradient(135deg, ${themeColors.title} 0%, ${themeColors.themeAccent} 50%, ${themeColors.themeLight} 100%)`,
  elegant: `linear-gradient(135deg, ${themeColors.theme} 0%, ${themeColors.title} 50%, ${themeColors.themeAccent} 100%)`,
  subtle: `linear-gradient(135deg, ${themeColors.themeAccent} 0%, ${themeColors.themeLight} 100%)`,
}

export default function GradientText({
  children,
  className = '',
  gradient,
  tag = 'h2',
  variant = 'default',
}: GradientTextProps) {
  const Tag = tag as keyof JSX.IntrinsicElements
  const uniqueId = useId().replace(/:/g, '-')
  // Default to theme colors - use custom gradient only if explicitly provided
  const gradientStyle = gradient ?? gradientVariants[variant]

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .gradient-text-${uniqueId} {
            background-image: ${gradientStyle};
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
            display: inline-block;
          }
          .gradient-text-${uniqueId} * {
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
          }
        `
      }} />
      <Tag
        className={`gradient-text-${uniqueId} ${className}`}
      >
        {children}
      </Tag>
    </>
  )
}

