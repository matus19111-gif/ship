import { GrowthSnapshot } from './growth'

export type NotificationType = 'conversion' | 'live' | 'hotstats' | 'cta' | 'purchase' | 'signup' | 'growth'
export type NotificationPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
export type NotificationTheme = 'light' | 'dark'

export interface Notification {
  id: string
  type: NotificationType
  firstName?: string
  city?: string
  state?: string
  country?: string
  product?: string
  minutesAgo?: number
  liveCount?: number
  statLabel?: string
  statValue?: string
  statPeriod?: string
  ctaTitle?: string
  ctaMessage?: string
  ctaButtonText?: string
  ctaButtonUrl?: string
  verifiedText?: string
  showVerified?: boolean
  // growth — carries the full snapshot so GrowthCard can render it
  growthSnapshot?: GrowthSnapshot
}

export interface SocialProofConfig {
  position: NotificationPosition
  theme: NotificationTheme
  initialDelay: number
  interval: number
  displayDuration: number
  showProgress: boolean
  enableSound: boolean
  showOnMobile: boolean
  maxNotifications?: number
}

export interface SocialProofContextType {
  config: SocialProofConfig
  notifications: Notification[]
  currentNotification: Notification | null
  isVisible: boolean
  isPaused: boolean
  pause: () => void
  resume: () => void
  dismiss: () => void
  updateConfig: (config: Partial<SocialProofConfig>) => void
}

export interface NotificationResponse {
  notifications: Notification[]
  config: SocialProofConfig
}
