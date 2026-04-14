'use client'

import React, {
  createContext, useContext, useEffect,
  useRef, useState, useCallback,
} from 'react'
import { Notification, SocialProofConfig, SocialProofContextType } from '@/types/social-proof'
import { defaultConfig, generateRandomNotification } from './data'

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
}

export function SocialProofProvider({ children, notifications: initialNotifications, config: configOverride }: Props) {
  const [config, setConfig] = useState<SocialProofConfig>({ ...defaultConfig, ...configOverride })
  const [notifications] = useState<Notification[]>(initialNotifications ?? [])
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const indexRef = useRef(0)
  const displayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isPausedRef = useRef(false)
  isPausedRef.current = isPaused

  const showNext = useCallback(() => {
    if (isPausedRef.current) return
    const pool = notifications.length > 0 ? notifications : null
    const next = pool ? pool[indexRef.current++ % pool.length] : generateRandomNotification()
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
