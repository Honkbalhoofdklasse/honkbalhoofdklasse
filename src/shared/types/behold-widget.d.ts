import type { DetailedHTMLProps, HTMLAttributes } from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'behold-widget': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        'feed-id': string
      }
    }
  }
}
