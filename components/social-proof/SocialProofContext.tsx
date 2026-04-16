'use client'

import React, {
  createContext, useContext, useEffect,
  useRef, useState, useCallback,
} from 'react'
import { Notification, SocialProofConfig, SocialProofContextType } from '@/types/social-proof'
import { GrowthSnapshot } from '@/types/growth'
import { defaultConfig } from '@/lib/growthEngine' // ← Changed: import from growth engine instead of ./data

const SocialProofContext = createContext<SocialProofContextType | null>(null)

export function useSocialProof() {
  const ctx = useContext(SocialProofContext)
  if (!ctx) throw new Error('useSocialProof must be used within SocialProofProvider')
  return ctx
}

interface Props {
  children: React.ReactNode
  notifications?: Notification[]
  config?: Partial<SocialProofConfig>
  // Optional: pass apiKey so the provider fetches growth snapshots itself
  apiKey?: string
}

// Convert a GrowthSnapshot into a Notification the popup system can display
function snapshotToNotification(snapshot: GrowthSnapshot): Notification {
  return {
    id: `growth-${snapshot.type}`,
    type: 'growth',
    growthSnapshot: snapshot,
  }
}

export function SocialProofProvider({ children, notifications: initialNotifications, config: configOverride, apiKey }: Props) {
  const [config, setConfig] = useState<SocialProofConfig>({ ...defaultConfig, ...configOverride })
  const [baseNotifications] = useState<Notification[]>(initialNotifications ?? [])
  const [growthNotifications, setGrowthNotifications] = useState<Notification[]>([])
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Fetch growth snapshots if apiKey is provided (client-side only, 60s cache)
  useEffect(() => {
    if (!apiKey) return
    let cancelled = false
    fetch(`/api/growth?apiKey=${encodeURIComponent(apiKey)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data.snapshots?.length) return
        const enabledSnapshots: GrowthSnapshot[] = data.snapshots.filter(
          (s: GrowthSnapshot) => s.enabled,
        )
        setGrowthNotifications(enabledSnapshots.map(snapshotToNotification))
      })
      .catch(() => {/* growth fetch is non-critical — fail silently */})
    return () => { cancelled = true }
  }, [apiKey])

  // Merge: base notifications first, then growth notifications
  const notifications = [...baseNotifications, ...growthNotifications]

  const indexRef = useRef(0)
  const displayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isPausedRef = useRef(false)
  isPausedRef.current = isPaused

  const showNext = useCallback(() => {
    if (isPausedRef.current) return
    if (!notifications.length) return
    const next = notifications[indexRef.current++ % notifications.length]
    setCurrentNotification(next)
    setIsVisible(true)
    if (displayTimerRef.current) clearTimeout(displayTimerRef.current)
    displayTimerRef.current = setTimeout(() => {
      if (!isPausedRef.current) setIsVisible(false)
    }, config.displayDuration * 1000)
  }, [notifications, config.displayDuration])

  const scheduleNext = useCallback(() => {
    if (intervalTimerRef.current) clearTimeout(intervalTimerRef.current)
    intervalTimerRef.current = setTimeout(() => {
      showNext()
      scheduleNext()
    }, config.interval * 1000)
  }, [config.interval, showNext])

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      showNext()
      scheduleNext()
    }, config.initialDelay * 1000)
    return () => {
      clearTimeout(initialTimer)
      if (displayTimerRef.current) clearTimeout(displayTimerRef.current)
      if (intervalTimerRef.current) clearTimeout(intervalTimerRef.current)
    }
  }, [config.initialDelay, showNext, scheduleNext])

  const pause = useCallback(() => {
    setIsPaused(true)
    if (displayTimerRef.current) clearTimeout(displayTimerRef.current)
  }, [])

  const resume = useCallback(() => {
    setIsPaused(false)
    displayTimerRef.current = setTimeout(() => setIsVisible(false), config.displayDuration * 1000)
  }, [config.displayDuration])

  const dismiss = useCallback(() => { setIsVisible(false); setIsPaused(false) }, [])

  const updateConfig = useCallback((partial: Partial<SocialProofConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }))
  }, [])

  return (
    <SocialProofContext.Provider value={{
      config, notifications, currentNotification,
      isVisible, isPaused, pause, resume, dismiss, updateConfig,
    }}>
      {children}
    </SocialProofContext.Provider>
  )
}
