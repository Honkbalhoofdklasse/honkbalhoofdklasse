'use client'

import { AudienceSection } from '../components/AudienceSection'
import { CasesSection } from '../components/CasesSection'
import { ContactSection } from '../components/ContactSection'
import { HeroSection } from '../components/HeroSection'
import { InstagramSection } from '../components/InstagramSection'
import { PartnersSection } from '../components/PartnersSection'
import { StatsSection } from '../components/StatsSection'
import { WhySection } from '../components/WhySection'

export function PartnerUpScreen() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <AudienceSection />
      <WhySection />
      <PartnersSection />
      <InstagramSection />
      <CasesSection />
      <ContactSection />
    </div>
  )
}
