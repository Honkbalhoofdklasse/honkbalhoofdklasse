'use client'

import PushNotifications from '@/shared/ui/PushNotifications'

type Props = { open: boolean; onToggle: () => void }

export default function MobileToggle({ open, onToggle }: Props) {
  return (
    <div className="xl:hidden flex items-center gap-1">
      <div className="xl:hidden">
        <PushNotifications />
      </div>
      <button className="flex flex-col gap-1.5 p-2 shrink-0" onClick={onToggle} aria-label="Menu">
        <span
          className={`block w-6 h-0.5 bg-white transition-all duration-200 origin-center ${open ? 'rotate-45 translate-y-2' : ''}`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-all duration-200 ${open ? 'opacity-0' : ''}`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-all duration-200 origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`}
        />
      </button>
    </div>
  )
}
