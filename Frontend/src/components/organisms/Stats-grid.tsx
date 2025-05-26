import { StatsCard,  } from "@/components/molecules/Stats-card"
import { StatsCardProps } from "@/types/statsTypes"

export interface StatsGridProps {
  cards: StatsCardProps[]
  loading?: boolean
  gridClassName?: string
}

export function StatsGrid({
  cards,
  loading,
  gridClassName = "grid gap-4 md:grid-cols-2 lg:grid-cols-5",
}: StatsGridProps) {
  return (
    <div className={gridClassName}>
      {cards.map((card, i) => (
        <StatsCard key={`${card.title}-${i}`} loading={loading} {...card} />
      ))}
    </div>
  )
}