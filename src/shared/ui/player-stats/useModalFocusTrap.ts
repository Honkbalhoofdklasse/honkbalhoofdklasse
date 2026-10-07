import { type RefObject, useEffect, useRef } from 'react'

export function useModalFocusTrap(modalRef: RefObject<HTMLDivElement | null>, onClose: () => void) {
  const previousFocusRef = useRef<Element | null>(null)

  // Focus trap + Escape handler
  useEffect(() => {
    previousFocusRef.current = document.activeElement

    const FOCUSABLE =
      'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'
    const modal = modalRef.current
    if (modal) {
      const first = modal.querySelectorAll<HTMLElement>(FOCUSABLE)[0]
      first?.focus()
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !modal) return
      const focusable = Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      ;(previousFocusRef.current as HTMLElement | null)?.focus()
    }
  }, [onClose])
}
