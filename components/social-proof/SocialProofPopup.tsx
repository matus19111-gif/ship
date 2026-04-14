'use client'

import { useEffect, useRef, useState } from 'react'
import { useSocialProof } from './SocialProofContext'
import { NotificationContent } from './NotificationCards'
import { NotificationPosition } from '@/types/social-proof'

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  )
}

function positionClasses(pos: NotificationPosition): string {
  switch (pos) {
    case 'bottom-left':  return 'bottom-4 left-4'
    case 'bottom-right': return 'bottom-4 right-4'
    case 'top-left':     return 'top-4 left-4'
    case 'top-right':    return 'top-4 right-4'
  }
}

export default function SocialProofPopup() {
  const { config, currentNotification, isVisible, isPaused, pause, resume, dismiss } = useSocialProof()
  const isDark = config.theme === 'dark'
  const [animClass, setAnimClass] = useState('')
  const [rendered, setRendered] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)
  const progressAnimRef = useRef<Animation | null>(null)

  useEffect(() => {
    if (isVisible && currentNotification) {
      setRendered(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimClass('entered')))
    } else {
      setAnimClass('exiting')
      const t = setTimeout(() => { setRendered(false); setAnimClass('') }, 350)
      return () => clearTimeout(t)
    }
  }, [isVisible, currentNotification])

  useEffect(() => {
    if (!config.showProgress || !progressRef.current) return
    if (progressAnimRef.current) { progressAnimRef.current.cancel(); progressAnimRef.current = null }
    if (isVisible && !isPaused) {
      progressAnimRef.current = progressRef.current.animate(
        [{ width: '100%' }, { width: '0%' }],
        { duration: config.displayDuration * 1000, easing: 'linear', fill: 'forwards' }
      )
    } else if (isPaused && progressAnimRef.current) {
      progressAnimRef.current.pause()
    }
  }, [isVisible, isPaused, config.showProgress, config.displayDuration, currentNotification])

  if (!rendered || !currentNotification) return null

  const isEntered = animClass === 'entered'
  const isExiting = animClass === 'exiting'
  const slideFrom = config.position.startsWith('bottom') ? 'translateY(24px)' : 'translateY(-24px)'

  return (
    <div className={`fixed z-[9999] ${positionClasses(config.position)}`} style={{ maxWidth: 320, width: 'calc(100vw - 2rem)' }}>
      <div
        style={{
          transform: isEntered ? 'translateY(0) scale(1)' : isExiting ? `${slideFrom} scale(0.95)` : slideFrom,
          opacity: isEntered ? 1 : 0,
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
        }}
        className={`relative rounded-2xl overflow-hidden select-none cursor-pointer ${
          isDark
            ? 'bg-gray-900 border border-gray-700/60 shadow-[0_8px_40px_rgba(0,0,0,0.6)]'
            : 'bg-white border border-gray-100 shadow-[0_4px_32px_rgba(0,0,0,0.10),0_1px_6px_rgba(0,0,0,0.06)]'
        }`}
        onMouseEnter={pause}
        onMouseLeave={resume}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        {config.showProgress && (
          <div className={`h-0.5 w-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div ref={progressRef} className="h-full rounded-full bg-blue-500" style={{ width: '100%' }} />
          </div>
        )}
        <div className={`px-4 py-3.5 ${currentNotification.type === 'cta' ? 'pb-4' : ''}`}>
          <NotificationContent notification={currentNotification} isDark={isDark} />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); dismiss() }}
          className={`absolute top-2.5 right-2.5 rounded-full p-1 transition-colors ${
            isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-300 hover:text-gray-500 hover:bg-gray-100'
          }`}
          aria-label="Dismiss notification"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}
