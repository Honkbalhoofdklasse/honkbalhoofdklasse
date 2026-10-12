'use client'

import { type CSSProperties, type ReactNode, useRef } from 'react'
import { useBodyScrollLock } from './useBodyScrollLock'
import { useModalFocusTrap } from './useModalFocusTrap'

type ModalProps = {
  onClose: () => void
  children: ReactNode
  label?: string
  labelledBy?: string
  overlayClassName: string
  panelClassName: string
  panelStyle?: CSSProperties
  backdrop?: ReactNode
}

export function Modal({
  onClose,
  children,
  label,
  labelledBy,
  overlayClassName,
  panelClassName,
  panelStyle,
  backdrop,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  useModalFocusTrap(panelRef, onClose)
  useBodyScrollLock()

  return (
    <div className={overlayClassName} onClick={onClose}>
      {backdrop}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`${panelClassName} outline-none`}
        style={panelStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
