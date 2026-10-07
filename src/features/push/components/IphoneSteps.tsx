import { NotifCard } from './NotifCard'
import { Step } from './Step'

export function IphoneSteps() {
  return (
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-6 bg-[var(--accent)] rounded-full shrink-0" />
        <h2 className="font-display font-800 italic text-3xl uppercase text-white">
          <strong>iPhone — Safari</strong>
        </h2>
      </div>

      <div className="mb-8 flex justify-center sm:justify-start">
        <NotifCard
          title="Lars Huijer is throwing a no-hitter!"
          body="PIR 0 hits allowed through 7 innings"
          time="live"
          color="#C8102E"
        />
      </div>

      <div className="space-y-7">
        <Step n={1} title="Open Safari">
          <p>
            Open the <strong className="text-white">Safari</strong> browser on your iPhone. Other
            browsers (Chrome, Firefox) do not support push notifications on iPhone.
          </p>
        </Step>
        <Step n={2} title="Go to honkbalhoofdklasse.com">
          <p>
            Type <strong className="text-white">honkbalhoofdklasse.com</strong> in the address bar
            and open the site.
          </p>
        </Step>
        <Step n={3} title="Tap the share button">
          <p>
            Tap the <strong className="text-white">share icon</strong> at the bottom of the screen,
            the square with an arrow pointing up. If it is not visible, scroll up slightly on the
            page.
          </p>
        </Step>
        <Step n={4} title="Add to Home Screen">
          <p>
            Scroll down in the share menu and tap{' '}
            <strong className="text-white">"Add to Home Screen"</strong>.
          </p>
        </Step>
        <Step n={5} title="Tap Add">
          <p>
            Confirm by tapping <strong className="text-white">"Add"</strong> in the top right. The
            Honkbal Hoofdklasse app is now on your home screen.
          </p>
        </Step>
        <Step n={6} title="Open the app from your home screen">
          <p>
            Important: always open the app{' '}
            <strong className="text-white">via the icon on your home screen</strong>, not via
            Safari. Push notifications only work this way.
          </p>
        </Step>
        <Step n={7} title="Tap the bell">
          <p>
            Tap the <strong className="text-white">bell icon</strong> in the top right corner.
            Choose your favorite teams and allow notifications. Done.
          </p>
        </Step>
      </div>
    </div>
  )
}
