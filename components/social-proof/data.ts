import { Notification, SocialProofConfig } from '@/types/social-proof'

export const defaultConfig: SocialProofConfig = {
  position: 'bottom-left',
  theme: 'light',
  initialDelay: 3,
  interval: 8,
  displayDuration: 5,
  showProgress: true,
  enableSound: false,
  showOnMobile: true,
}

const FIRST_NAMES = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
  'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia',
  'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander', 'Sarah', 'Michael',
  'Grace', 'Daniel', 'Chloe', 'Matthew', 'Lily', 'Jackson', 'Ella', 'Sebastian',
]

const CITIES = [
  { city: 'New York', state: 'NY', country: 'US' },
  { city: 'Los Angeles', state: 'CA', country: 'US' },
  { city: 'Chicago', state: 'IL', country: 'US' },
  { city: 'London', state: 'England', country: 'UK' },
  { city: 'Toronto', state: 'ON', country: 'CA' },
  { city: 'Sydney', state: 'NSW', country: 'AU' },
  { city: 'Berlin', state: '', country: 'DE' },
  { city: 'Paris', state: '', country: 'FR' },
  { city: 'Tokyo', state: '', country: 'JP' },
  { city: 'Amsterdam', state: '', country: 'NL' },
  { city: 'Seattle', state: 'WA', country: 'US' },
  { city: 'Austin', state: 'TX', country: 'US' },
  { city: 'Miami', state: 'FL', country: 'US' },
  { city: 'Barcelona', state: '', country: 'ES' },
  { city: 'Singapore', state: '', country: 'SG' },
]

const PRODUCTS = [
  'Pro Plan', 'Starter Bundle', 'Enterprise License', 'Annual Subscription',
  'Growth Pack', 'Team Plan', 'Basic Plan', 'Premium Access',
  'Lifetime Deal', 'Business Suite', 'Creator Pack', 'Developer Kit',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateConversionNotification(id?: string): Notification {
  const location = pick(CITIES)
  return {
    id: id ?? `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: 'conversion',
    firstName: pick(FIRST_NAMES),
    city: location.city,
    state: location.state,
    country: location.country,
    product: pick(PRODUCTS),
    minutesAgo: randomInt(2, 47),
    showVerified: true,
    verifiedText: 'Verified purchase',
  }
}

export function generateLiveNotification(id?: string): Notification {
  return {
    id: id ?? `live-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: 'live',
    liveCount: randomInt(12, 340),
    showVerified: false,
  }
}

export function generateHotStatsNotification(id?: string): Notification {
  const stats = [
    { label: 'purchases in the last 24 hours', value: String(randomInt(40, 280)), period: '24h' },
    { label: 'people joined this week', value: String(randomInt(120, 890)), period: '7d' },
    { label: 'active customers today', value: String(randomInt(800, 3200)), period: 'today' },
    { label: 'sales this month', value: String(randomInt(1200, 6400)), period: '30d' },
  ]
  const stat = pick(stats)
  return {
    id: id ?? `hot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: 'hotstats',
    statLabel: stat.label,
    statValue: stat.value,
    statPeriod: stat.period,
    showVerified: false,
  }
}

/**
 * ADDED THIS: The missing export that was breaking the build
 */
export function generateRandomNotification(): Notification {
  const types: Array<'conversion' | 'live' | 'hotstats'> = ['conversion', 'live', 'hotstats']
  const type = pick(types)

  switch (type) {
    case 'conversion':
      return generateConversionNotification()
    case 'live':
      return generateLiveNotification()
    case 'hotstats':
      return generateHotStatsNotification()
    default:
      return generateConversionNotification()
  }
}
