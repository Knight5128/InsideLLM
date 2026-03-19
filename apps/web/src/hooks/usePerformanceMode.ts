import { useEffect, useState } from 'react'

import { useAppStore } from '@/stores/useAppStore'

function detectCompactMode() {
  if (typeof window === 'undefined') {
    return false
  }

  const narrow = window.innerWidth < 960
  const lowCpu = typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4

  return narrow || lowCpu
}

export function usePerformanceMode() {
  const motionReduced = useAppStore((state) => state.motionReduced)
  const [compactMode, setCompactMode] = useState(detectCompactMode)

  useEffect(() => {
    const onResize = () => setCompactMode(detectCompactMode())

    onResize()
    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [])

  return {
    motionReduced,
    compactMode,
    prefersLiteScene: motionReduced || compactMode,
  }
}
