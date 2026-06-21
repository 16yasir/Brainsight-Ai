'use client'

import { Fragment, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BeamPath {
  path: string
  gradientConfig: {
    initial: {
      x1: string
      x2: string
      y1: string
      y2: string
    }
    animate: {
      x1: string | string[]
      x2: string | string[]
      y1: string | string[]
      y2: string | string[]
    }
    transition?: {
      duration?: number
      repeat?: number
      repeatType?: 'loop' | 'reverse' | 'mirror'
      ease?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
      repeatDelay?: number
      delay?: number
    }
  }
  connectionPoints?: Array<{
    cx: number
    cy: number
    r: number
  }>
}

interface PulseBeamsProps {
  children?: ReactNode
  className?: string
  background?: ReactNode
  beams: BeamPath[]
  width?: number
  height?: number
  baseColor?: string
  accentColor?: string
  gradientColors?: {
    start: string
    middle: string
    end: string
  }
}

interface SVGsProps {
  beams: BeamPath[]
  width: number
  height: number
  baseColor: string
  accentColor: string
  gradientColors?: {
    start: string
    middle: string
    end: string
  }
}

const PULSE_COPIES = 4

export const PulseBeams = ({
  children,
  className,
  background,
  beams,
  width = 858,
  height = 434,
  baseColor = 'var(--slate-800)',
  accentColor = 'var(--slate-600)',
  gradientColors,
}: PulseBeamsProps) => {
  return (
    <div
      className={cn(
        'relative flex h-screen w-full items-center justify-center overflow-hidden antialiased',
        className,
      )}
    >
      {background}
      <div className="relative z-10 w-full flex justify-center">{children}</div>
      <div className="hidden md:absolute md:inset-0 md:flex md:items-center md:justify-center w-full overflow-hidden">
        <SVGs
          accentColor={accentColor}
          baseColor={baseColor}
          beams={beams}
          gradientColors={gradientColors}
          height={height}
          width={width}
        />
      </div>
    </div>
  )
}

const SVGs = ({ beams, width, height, baseColor, accentColor, gradientColors }: SVGsProps) => {
  return (
    <svg
      className="flex flex-shrink-0 w-full h-auto max-w-full"
      fill="none"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {beams.map((beam, index) => (
        <Fragment key={index}>
          <path d={beam.path} stroke={baseColor} strokeWidth="1" />
          {Array.from({ length: PULSE_COPIES }).map((_, pulseIndex) => (
            <path
              key={`${index}-pulse-${pulseIndex}`}
              d={beam.path}
              stroke={`url(#grad${index}-${pulseIndex})`}
              strokeLinecap="round"
              strokeWidth="2"
            />
          ))}
          {beam.connectionPoints?.map((point, pointIndex) => (
            <circle
              key={`${index}-${pointIndex}`}
              cx={point.cx}
              cy={point.cy}
              fill={baseColor}
              r={point.r}
              stroke={accentColor}
            />
          ))}
        </Fragment>
      ))}

      <defs>
        {beams.flatMap((beam, index) =>
          Array.from({ length: PULSE_COPIES }).map((_, pulseIndex) => {
            const duration = beam.gradientConfig.transition?.duration ?? 2
            const baseDelay = beam.gradientConfig.transition?.delay ?? 0
            const pulseOffset = (duration / PULSE_COPIES) * pulseIndex

            return (
              <motion.linearGradient
                key={`${index}-${pulseIndex}`}
                animate={beam.gradientConfig.animate}
                gradientUnits="userSpaceOnUse"
                id={`grad${index}-${pulseIndex}`}
                initial={beam.gradientConfig.initial}
                transition={{
                  ...beam.gradientConfig.transition,
                  repeat: Infinity,
                  repeatDelay: 0,
                  delay: baseDelay + pulseOffset,
                }}
              >
                <GradientColors colors={gradientColors} />
              </motion.linearGradient>
            )
          }),
        )}
      </defs>
    </svg>
  )
}

const GradientColors = ({
  colors = {
    start: '#18CCFC',
    middle: '#6344F5',
    end: '#AE48FF',
  },
}: {
  colors?: {
    start: string
    middle: string
    end: string
  }
}) => {
  return (
    <>
      <stop offset="0%" stopColor={colors.start} stopOpacity="0" />
      <stop offset="20%" stopColor={colors.start} stopOpacity="1" />
      <stop offset="50%" stopColor={colors.middle} stopOpacity="1" />
      <stop offset="100%" stopColor={colors.end} stopOpacity="0" />
    </>
  )
}
