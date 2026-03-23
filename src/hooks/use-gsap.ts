'use client'

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Observer)
}

// Hook for scroll-as-navigation with gesture support
export function useScrollNavigation({
  onSectionChange,
  totalSections,
  enabled = true,
}: {
  onSectionChange: (index: number) => void
  totalSections: number
  enabled?: boolean
}) {
  const currentIndex = useRef(0)
  const isAnimating = useRef(false)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const observer = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: 1,
      dragMinimum: 30,
      tolerance: 10,
      preventDefault: false,
      onDown: () => {
        if (isAnimating.current) return
        if (currentIndex.current < totalSections - 1) {
          isAnimating.current = true
          currentIndex.current++
          onSectionChange(currentIndex.current)
          setTimeout(() => {
            isAnimating.current = false
          }, 600)
        }
      },
      onUp: () => {
        if (isAnimating.current) return
        if (currentIndex.current > 0) {
          isAnimating.current = true
          currentIndex.current--
          onSectionChange(currentIndex.current)
          setTimeout(() => {
            isAnimating.current = false
          }, 600)
        }
      },
    })

    return () => {
      observer.kill()
    }
  }, [enabled, totalSections, onSectionChange])
}

// Hook for entrance animations
export function useEntranceAnimation(
  selector: string,
  options?: {
    delay?: number
    duration?: number
    y?: number
    opacity?: number
    stagger?: number
  }
) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      gsap.from(selector, {
        y: options?.y ?? 30,
        opacity: options?.opacity ?? 0,
        duration: options?.duration ?? 0.6,
        delay: options?.delay ?? 0,
        stagger: options?.stagger ?? 0.1,
        ease: 'power2.out',
      })
    })

    return () => ctx.revert()
  }, [selector, options])
}

// Hook for stagger animations
export function useStaggerAnimation(
  containerRef: React.RefObject<HTMLElement>,
  childSelector: string,
  options?: {
    delay?: number
    duration?: number
    y?: number
    x?: number
    opacity?: number
    stagger?: number
    trigger?: 'load' | 'scroll'
  }
) {
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    const ctx = gsap.context(() => {
      const animation = {
        y: options?.y ?? 20,
        x: options?.x ?? 0,
        opacity: options?.opacity ?? 0,
        duration: options?.duration ?? 0.5,
        stagger: options?.stagger ?? 0.05,
        ease: 'power2.out',
        delay: options?.delay ?? 0,
      }

      if (options?.trigger === 'scroll') {
        gsap.from(childSelector, {
          ...animation,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      } else {
        gsap.from(childSelector, animation)
      }
    }, containerRef)

    return () => ctx.revert()
  }, [containerRef, childSelector, options])
}

// Hook for parallax effect
export function useParallax(
  elementRef: React.RefObject<HTMLElement>,
  speed: number = 0.5
) {
  useEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(elementRef.current, {
        y: () => window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: elementRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, elementRef)

    return () => ctx.revert()
  }, [elementRef, speed])
}

// Hook for scroll-triggered animations
export function useScrollTrigger(
  elementRef: React.RefObject<HTMLElement>,
  animationProps: gsap.TweenVars,
  scrollTriggerProps?: ScrollTrigger.Vars
) {
  useEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return

    const ctx = gsap.context(() => {
      gsap.from(elementRef.current, {
        ...animationProps,
        scrollTrigger: {
          trigger: elementRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          ...scrollTriggerProps,
        },
      })
    }, elementRef)

    return () => ctx.revert()
  }, [elementRef, animationProps, scrollTriggerProps])
}

// Hook for chapter-like section animations
export function useChapterAnimation(
  sectionRef: React.RefObject<HTMLElement>,
  options?: {
    fadeIn?: boolean
    slideFrom?: 'left' | 'right' | 'top' | 'bottom'
    duration?: number
  }
) {
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return

    const ctx = gsap.context(() => {
      const slideFrom = options?.slideFrom ?? 'bottom'
      const initialProps: gsap.TweenVars = {
        opacity: options?.fadeIn !== false ? 0 : 1,
        duration: options?.duration ?? 0.8,
        ease: 'power3.out',
      }

      switch (slideFrom) {
        case 'left':
          initialProps.x = -100
          break
        case 'right':
          initialProps.x = 100
          break
        case 'top':
          initialProps.y = -80
          break
        case 'bottom':
        default:
          initialProps.y = 80
          break
      }

      gsap.from(sectionRef.current, {
        ...initialProps,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef, options])
}

// Hook for text reveal animation
export function useTextReveal(
  elementRef: React.RefObject<HTMLElement>,
  options?: {
    duration?: number
    stagger?: number
    trigger?: boolean
  }
) {
  useEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return

    const ctx = gsap.context(() => {
      const chars = elementRef.current!.innerText.split('')
      elementRef.current!.innerHTML = chars
        .map((char) => `<span class="char inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
        .join('')

      const animation: gsap.TweenVars = {
        opacity: 0,
        y: 20,
        duration: options?.duration ?? 0.05,
        stagger: options?.stagger ?? 0.02,
        ease: 'power2.out',
      }

      if (options?.trigger) {
        gsap.from('.char', {
          ...animation,
          scrollTrigger: {
            trigger: elementRef.current,
            start: 'top 80%',
          },
        })
      } else {
        gsap.from('.char', animation)
      }
    }, elementRef)

    return () => ctx.revert()
  }, [elementRef, options])
}

// Hook for card flip animation
export function useFlipAnimation(
  elementRef: React.RefObject<HTMLElement>,
  isFlipped: boolean
) {
  useEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(elementRef.current, {
        rotationY: isFlipped ? 180 : 0,
        duration: 0.6,
        ease: 'power2.inOut',
      })
    }, elementRef)

    return () => ctx.revert()
  }, [elementRef, isFlipped])
}

// Hook for pulse animation
export function usePulseAnimation(
  elementRef: React.RefObject<HTMLElement>,
  options?: {
    scale?: number
    duration?: number
    repeat?: number
  }
) {
  useEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(elementRef.current, {
        scale: options?.scale ?? 1.05,
        duration: options?.duration ?? 0.5,
        repeat: options?.repeat ?? -1,
        yoyo: true,
        ease: 'power1.inOut',
      })
    }, elementRef)

    return () => ctx.revert()
  }, [elementRef, options])
}

// Utility to create a timeline
export function useTimeline(callback: (tl: gsap.core.Timeline) => void) {
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    tlRef.current = gsap.timeline()
    callback(tlRef.current)

    return () => {
      tlRef.current?.kill()
    }
  }, [callback])

  return tlRef
}

// Export gsap for direct use
export { gsap, ScrollTrigger, Observer }
