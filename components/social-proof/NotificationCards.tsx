import { Notification } from '@/types/social-proof'
import { GrowthCard } from './GrowthCard'

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
      <circle cx={12} cy={9} r={2.5} />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx={9} cy={7} r={4} />
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c4.418 0 8-3.134 8-7 0-2.5-1.5-4.5-3-6-1 2-2 3-4 3-1.5 0-2.5-.75-3-2C8.5 12 7 14.5 7 17c0 2.761 2.239 5 5 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c-2.21 0-4-1.5-4-4 0-1.5.75-2.75 2-3.5.5 1 1.5 1.5 2.5 1.5s1.75-.5 2-1.5c.75 1 1.5 2 1.5 3.5 0 2.21-1.79 4-4 4z" />
    </svg>
  )
}

function CheckBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.491 4.491 0 0 1-3.497-1.307 4.491 4.491 0 0 1-1.307-3.497A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.491 4.491 0 0 1 1.307-3.497 4.491 4.491 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
  )
}

export function ConversionCard({ n, isDark }: { n: Notification; isDark: boolean }) {
  const location = [n.city, n.state].filter(Boolean).join(', ')
  return (
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
        <MapPinIcon />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <span className="font-bold">{n.firstName}</span>{' '}from{' '}
          <span className="font-bold">{location || n.country}</span>
        </p>
        <p className={`text-sm mt-0.5 leading-tight ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          purchased{' '}
          <span className={`font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>{n.product}</span>
        </p>
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {n.minutesAgo} min ago
        </p>
        {n.showVerified && (
          <p className={`flex items-center gap-1 text-xs mt-1 ${isDark ? 'text-blue-400' : 'text-blue-500'}`}>
            <CheckBadgeIcon />
            {n.verifiedText}
          </p>
        )}
      </div>
    </div>
  )
}

export function LiveCard({ n, isDark }: { n: Notification; isDark: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-50 text-green-600'}`}>
        <UsersIcon />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-2xl font-black tabular-nums ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {n.liveCount?.toLocaleString()}
          </p>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
        <p className={`text-sm mt-0.5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          people viewing this page right now
        </p>
      </div>
    </div>
  )
}

export function HotStatsCard({ n, isDark }: { n: Notification; isDark: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-orange-900/50 text-orange-400' : 'bg-orange-50 text-orange-500'}`}>
        <FlameIcon />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-2xl font-black tabular-nums leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {n.statValue}
        </p>
        <p className={`text-sm mt-0.5 leading-tight ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {n.statLabel}
        </p>
      </div>
    </div>
  )
}

export function CtaCard({ n, isDark }: { n: Notification; isDark: boolean }) {
  return (
    <div className="text-center">
      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{n.ctaTitle}</p>
      <p className={`text-sm mt-1 leading-snug ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{n.ctaMessage}</p>
      {n.ctaButtonText && (
        <a
          href={n.ctaButtonUrl ?? '#'}
          className="mt-3 inline-block px-4 py-1.5 rounded-md text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          {n.ctaButtonText}
        </a>
      )}
    </div>
  )
}

export function NotificationContent({ notification, isDark }: { notification: Notification; isDark: boolean }) {
  switch (notification.type) {
    case 'conversion':
    case 'purchase':
    case 'signup':
      return <ConversionCard n={notification} isDark={isDark} />
    case 'live':      return <LiveCard n={notification} isDark={isDark} />
    case 'hotstats':  return <HotStatsCard n={notification} isDark={isDark} />
    case 'cta':       return <CtaCard n={notification} isDark={isDark} />
    case 'growth':
      if (!notification.growthSnapshot) return null
      return <GrowthCard snapshot={notification.growthSnapshot} isDark={isDark} />
    default:          return null
  }
}
