'use client'

import type { KnbsbCategory, OnSelect } from '../domain/types'
import CategoryCard from './CategoryCard'

export default function SeasonCategoryGrid({
  categories,
  statType,
  onSelect,
}: {
  categories: KnbsbCategory[]
  statType: 'batting' | 'pitching'
  onSelect: OnSelect
}) {
  if (categories.length === 0) {
    return (
      <p className="font-display font-700 text-[var(--muted)] text-sm uppercase tracking-widest py-10 text-center">
        No data available
      </p>
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((cat) => (
        <CategoryCard key={cat.type} category={cat} statType={statType} onSelect={onSelect} />
      ))}
    </div>
  )
}
