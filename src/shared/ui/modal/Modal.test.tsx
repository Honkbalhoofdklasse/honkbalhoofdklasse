import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

function Host() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        opener
      </button>
      {open && (
        <Modal onClose={() => setOpen(false)} label="Test" overlayClassName="o" panelClassName="p">
          <button type="button">first</button>
          <button type="button">last</button>
        </Modal>
      )}
    </>
  )
}

afterEach(cleanup)

describe('Modal', () => {
  it('renders a labelled dialog and focuses the first control', async () => {
    render(<Host />)
    await userEvent.click(screen.getByText('opener'))
    expect(screen.getByRole('dialog', { name: 'Test' })).toBeTruthy()
    expect(document.activeElement).toBe(screen.getByText('first'))
  })

  it('cycles focus with Tab and Shift+Tab', async () => {
    render(<Host />)
    await userEvent.click(screen.getByText('opener'))
    await userEvent.tab()
    expect(document.activeElement).toBe(screen.getByText('last'))
    await userEvent.tab()
    expect(document.activeElement).toBe(screen.getByText('first'))
    await userEvent.tab({ shift: true })
    expect(document.activeElement).toBe(screen.getByText('last'))
  })

  it('closes on Escape and restores focus to the opener', async () => {
    render(<Host />)
    const opener = screen.getByText('opener')
    await userEvent.click(opener)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(opener)
  })

  it('closes on backdrop click but not on panel click', () => {
    const onClose = vi.fn()
    render(
      <Modal onClose={onClose} label="T" overlayClassName="o" panelClassName="p">
        <span>inside</span>
      </Modal>,
    )
    fireEvent.click(screen.getByText('inside'))
    expect(onClose).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('dialog').parentElement as HTMLElement)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('keeps focus inside when the parent re-renders with a new onClose', async () => {
    const { rerender } = render(<Host />)
    await userEvent.click(screen.getByText('opener'))
    await userEvent.tab()
    expect(document.activeElement).toBe(screen.getByText('last'))
    rerender(<Host />)
    expect(document.activeElement).toBe(screen.getByText('last'))
  })

  it('locks body scroll while open', async () => {
    render(<Host />)
    await userEvent.click(screen.getByText('opener'))
    expect(document.body.style.overflow).toBe('hidden')
    await userEvent.keyboard('{Escape}')
    expect(document.body.style.overflow).toBe('')
  })
})
