'use client'

import { useEffect, useRef } from 'react'

interface EntropyProps {
  className?: string
  size?: number
}

const PARTICLE_COLOR = '#ffffff'
const INTERACTION_RADIUS = 80
const CHAOS_WANDER = 0.24

interface PointerState {
  active: boolean
  x: number
  y: number
}

class EntropyParticle {
  x: number
  y: number
  size: number
  order: boolean
  velocity: { x: number; y: number }
  originalX: number
  originalY: number
  influence: number
  neighbors: EntropyParticle[]
  disturbance: number

  constructor(x: number, y: number, order: boolean) {
    this.x = x
    this.y = y
    this.originalX = x
    this.originalY = y
    this.size = 2
    this.order = order
    this.velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
    }
    this.influence = 0
    this.neighbors = []
    this.disturbance = 0
  }

  update(canvasSize: number, pointer: PointerState) {
    let targetDisturbance = 0

    if (this.order) {
      const dx = this.originalX - this.x
      const dy = this.originalY - this.y
      const chaosInfluence = { x: 0, y: 0 }
      let cursorForceX = 0
      let cursorForceY = 0

      this.neighbors.forEach((neighbor) => {
        if (!neighbor.order) {
          const distance = Math.hypot(this.x - neighbor.x, this.y - neighbor.y)
          const strength = Math.max(0, 1 - distance / 100)
          chaosInfluence.x += neighbor.velocity.x * strength
          chaosInfluence.y += neighbor.velocity.y * strength
          this.influence = Math.max(this.influence, strength)
        }
      })

      if (pointer.active) {
        const dxMouse = this.x - pointer.x
        const dyMouse = this.y - pointer.y
        const distance = Math.hypot(dxMouse, dyMouse)

        if (distance > 0 && distance < INTERACTION_RADIUS) {
          const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS
          const angle = Math.atan2(dyMouse, dxMouse)

          cursorForceX = Math.cos(angle) * force * 10
          cursorForceY = Math.sin(angle) * force * 10
          targetDisturbance = force
        }
      }

      this.x += dx * 0.05 * (1 - this.influence) + chaosInfluence.x * this.influence + cursorForceX * 0.3
      this.y += dy * 0.05 * (1 - this.influence) + chaosInfluence.y * this.influence + cursorForceY * 0.3
      this.influence *= 0.99
      this.x = Math.max(0, Math.min(canvasSize / 2, this.x))
      this.y = Math.max(0, Math.min(canvasSize, this.y))
    } else {
      this.velocity.x += (Math.random() - 0.5) * CHAOS_WANDER
      this.velocity.y += (Math.random() - 0.5) * CHAOS_WANDER

      if (pointer.active) {
        const dxMouse = this.x - pointer.x
        const dyMouse = this.y - pointer.y
        const distance = Math.hypot(dxMouse, dyMouse)

        if (distance > 0 && distance < INTERACTION_RADIUS) {
          const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS
          const angle = Math.atan2(dyMouse, dxMouse)

          this.velocity.x += Math.cos(angle) * force * 2
          this.velocity.y += Math.sin(angle) * force * 2
          targetDisturbance = force
        }
      }

      this.velocity.x *= 0.95
      this.velocity.y *= 0.95
      this.x += this.velocity.x
      this.y += this.velocity.y

      if (this.x < canvasSize / 2 || this.x > canvasSize) this.velocity.x *= -1
      if (this.y < 0 || this.y > canvasSize) this.velocity.y *= -1
      this.x = Math.max(canvasSize / 2, Math.min(canvasSize, this.x))
      this.y = Math.max(0, Math.min(canvasSize, this.y))
    }

    this.disturbance += (targetDisturbance - this.disturbance) * 0.12
  }

  draw(context: CanvasRenderingContext2D) {
    const baseAlpha = this.order ? 0.8 - this.influence * 0.5 : 0.8
    const alpha = Math.min(1, baseAlpha + this.disturbance * 0.18)
    const glowAlpha = Math.min(0.35, this.disturbance * 0.32)
    const glowRadius = this.size + this.disturbance * 2.8

    if (glowAlpha > 0.02) {
      context.fillStyle = `${PARTICLE_COLOR}${Math.round(glowAlpha * 255)
        .toString(16)
        .padStart(2, '0')}`
      context.beginPath()
      context.arc(this.x, this.y, glowRadius, 0, Math.PI * 2)
      context.fill()
    }

    context.fillStyle = `${PARTICLE_COLOR}${Math.round(alpha * 255)
      .toString(16)
      .padStart(2, '0')}`
    context.beginPath()
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    context.fill()
  }
}

export function Entropy({ className = '', size = 400 }: EntropyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const renderCtx = ctx
    const pointer: PointerState = {
      active: false,
      x: size / 2,
      y: size / 2,
    }

    const particles: EntropyParticle[] = []
    const gridSize = 25
    const spacing = size / gridSize

    for (let i = 0; i < gridSize; i += 1) {
      for (let j = 0; j < gridSize; j += 1) {
        const x = spacing * i + spacing / 2
        const y = spacing * j + spacing / 2
        const order = x < size / 2
        particles.push(new EntropyParticle(x, y, order))
      }
    }

    function updateNeighbors() {
      particles.forEach((particle) => {
        particle.neighbors.length = 0
      })

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const particle = particles[i]
          const other = particles[j]
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y)

          if (distance < 100) {
            particle.neighbors.push(other)
            other.neighbors.push(particle)
          }
        }
      }
    }

    let time = 0
    let animationId = 0

    function animate() {
      renderCtx.clearRect(0, 0, size, size)

      if (time % 30 === 0) {
        updateNeighbors()
      }

      particles.forEach((particle) => {
        particle.update(size, pointer)
        particle.draw(renderCtx)

        particle.neighbors.forEach((neighbor) => {
          const distance = Math.hypot(particle.x - neighbor.x, particle.y - neighbor.y)
          if (distance < 50) {
            const disturbanceGlow = Math.max(particle.disturbance, neighbor.disturbance)
            const alpha = 0.2 * (1 - distance / 50) + disturbanceGlow * 0.08
            renderCtx.strokeStyle = `${PARTICLE_COLOR}${Math.round(alpha * 255)
              .toString(16)
              .padStart(2, '0')}`
            renderCtx.beginPath()
            renderCtx.moveTo(particle.x, particle.y)
            renderCtx.lineTo(neighbor.x, neighbor.y)
            renderCtx.stroke()
          }
        })
      })

      renderCtx.strokeStyle = `${PARTICLE_COLOR}4D`
      renderCtx.lineWidth = 0.5
      renderCtx.beginPath()
      renderCtx.moveTo(size / 2, 0)
      renderCtx.lineTo(size / 2, size)
      renderCtx.stroke()

      renderCtx.font = '12px monospace'
      renderCtx.fillStyle = '#ffffff'
      renderCtx.textAlign = 'center'

      time += 1
      animationId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (event: MouseEvent) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.active = true
      pointer.x = event.clientX - bounds.left
      pointer.y = event.clientY - bounds.top
    }

    const handleMouseLeave = () => {
      pointer.active = false
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    animate()

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [size])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let frameId = 0
    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0

    const animate = () => {
      currentX += (targetX - currentX) * 0.08
      currentY += (targetY - currentY) * 0.08
      container.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      frameId = requestAnimationFrame(animate)
    }

    const handleMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect()
      const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5
      const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5

      targetX = relativeX * 14
      targetY = relativeY * 14
    }

    const handleLeave = () => {
      targetX = 0
      targetY = 0
    }

    container.addEventListener('pointermove', handleMove)
    container.addEventListener('pointerleave', handleLeave)
    frameId = requestAnimationFrame(animate)

    return () => {
      container.removeEventListener('pointermove', handleMove)
      container.removeEventListener('pointerleave', handleLeave)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ width: size, height: size, willChange: 'transform' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  )
}
