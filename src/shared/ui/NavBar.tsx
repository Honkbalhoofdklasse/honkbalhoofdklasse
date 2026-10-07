'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchModal from '@/shared/ui/SearchModal'
import DesktopNav from './nav/DesktopNav'
import MobileMenu from './nav/MobileMenu'
import MobileToggle from './nav/MobileToggle'
import { useNavEntries } from './nav/navEntries'

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const transparent = isHome && !scrolled
  const entries = useNavEntries()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((s) => !s)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setOpenGroup(null)
  }, [pathname])

  return (
    <>
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          transparent
            ? 'bg-transparent border-transparent'
            : 'bg-[var(--card)]/95 backdrop-blur-md border-b border-[var(--border)]'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="https://res.cloudinary.com/dn8c5398m/image/upload/q_auto/f_auto/v1781607525/hk_logo_iets_groter_tumykq.png"
              alt="Honkbal Hoofdklasse"
              width={64}
              height={64}
              className="object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <DesktopNav
            entries={entries}
            pathname={pathname}
            onSearchOpen={() => setSearchOpen(true)}
          />

          {/* Mobile: bell + hamburger */}
          <MobileToggle open={open} onToggle={() => setOpen((o) => !o)} />
        </div>

        {/* Mobile menu */}
        <MobileMenu
          open={open}
          entries={entries}
          pathname={pathname}
          openGroup={openGroup}
          setOpenGroup={setOpenGroup}
          onSearch={() => {
            setOpen(false)
            setSearchOpen(true)
          }}
        />
      </nav>
    </>
  )
}
