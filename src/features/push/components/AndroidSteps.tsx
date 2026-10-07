import { NotifCard } from './NotifCard'
import { Step } from './Step'

export function AndroidSteps() {
  return (
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-6 bg-[var(--accent)] rounded-full shrink-0" />
        <h2 className="font-display font-800 italic text-3xl uppercase text-white">
          <strong>Android — Chrome</strong>
        </h2>
      </div>

      <div className="mb-8 flex justify-center sm:justify-start">
        <NotifCard
          title="Final: Neptunus 7, UVV 2"
          body="WP: Kevin Kelly. Game over."
          time="2m ago"
          color="#003087"
        />
      </div>

      <div className="space-y-7">
        <Step n={1} title="Open Chrome">
          <p>
            Open <strong className="text-white">Google Chrome</strong> on your Android phone and go
            to <strong className="text-white">honkbalhoofdklasse.com</strong>.
          </p>
        </Step>
        <Step n={2} title="Add to home screen">
          <p>
            Tap the <strong className="text-white">three dots</strong> in the top right and choose{' '}
            <strong className="text-white">"Add to Home screen"</strong>. On some versions a banner
            appears at the bottom automatically.
          </p>
        </Step>
        <Step n={3} title="Install the app">
          <p>
            Tap <strong className="text-white">"Add"</strong> or{' '}
            <strong className="text-white">"Install"</strong>. The app is now on your home screen.
          </p>
        </Step>
        <Step n={4} title="Tap the bell">
          <p>
            Open the app from the icon, tap the <strong className="text-white">bell</strong> in the
            top right, choose your teams and allow notifications.
          </p>
        </Step>
      </div>
    </div>
  )
}
