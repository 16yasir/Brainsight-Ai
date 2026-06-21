'use client'

import { Entropy } from '@/components/ui/entropy'
import { PulseBeams } from '@/components/ui/pulse-beams'

export function EntropyDemo() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black p-8 text-white">
      <div className="flex flex-col items-center">
        <Entropy className="rounded-lg" />
        <div className="mt-6 text-center">
          <div className="space-y-4 font-mono text-[14px] leading-relaxed">
            <p className="italic tracking-wide text-gray-400/80">
              &ldquo;Order and chaos dance &mdash;
              <span className="opacity-70">digital poetry in motion.&rdquo;</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const beams = [
  {
    path: 'M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5',
    gradientConfig: {
      initial: { x1: '0%', x2: '0%', y1: '80%', y2: '100%' },
      animate: {
        x1: ['0%', '0%', '200%'],
        x2: ['0%', '0%', '180%'],
        y1: ['80%', '0%', '0%'],
        y2: ['100%', '20%', '20%'],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop' as const,
        ease: 'linear' as const,
        repeatDelay: 2,
        delay: Math.random() * 2,
      },
    },
    connectionPoints: [
      { cx: 6.5, cy: 398.5, r: 6 },
      { cx: 269, cy: 220.5, r: 6 },
    ],
  },
]

const gradientColors = {
  start: '#00D4A8',
  middle: '#6EC9FF',
  end: '#00FFD0',
}

export function PulseBeamsFirstDemo() {
  return (
    <PulseBeams
      baseColor="rgba(240,244,255,0.18)"
      beams={beams}
      className="!h-[180px] !w-[360px]"
      gradientColors={gradientColors}
    >
      <button className="inline-flex h-[78px] w-[280px] cursor-pointer items-center justify-center rounded-full border border-white/10 bg-[#07111d] px-8 text-lg font-semibold text-white">
        Connect
      </button>
    </PulseBeams>
  )
}

export { EntropyDemo as default }
