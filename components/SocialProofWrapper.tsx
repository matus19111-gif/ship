'use client'

import { useEffect, useState } from 'react'
import { SocialProofProvider, SocialProofPopup } from '@/components/social-proof'
import { Notification, SocialProofConfig } from '@/types/social-proof'

const API_KEY = process.env.NEXT_PUBLIC_PROOFPOP_API_KEY ?? ''

export default function SocialProofWrapper({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [socialConfig, setSocialConfig] = useState<Partial<SocialProofConfig>>({})

  useEffect(() => {
    if (!API_KEY) return
    fetch(`/api/event?apiKey=${API_KEY}&count=20`)
      .then(r => r.json())
      .then(({ notifications, config }) => {
        if (notifications) setNotifications(notifications)
        if (config) setSocialConfig(config)
      })
      .catch(() => {})
  }, [])

  return (
    <SocialProofProvider notifications={notifications} config={socialConfig}>
      {children}
      <SocialProofPopup />
    </SocialProofProvider>
  )
}
