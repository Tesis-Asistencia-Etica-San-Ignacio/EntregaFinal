import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../atoms/ui/card"
import { StatsCardProps } from "@/types/statsTypes"



export function StatsCard({ title, value, description, icon, loading, }: StatsCardProps) {
  return (
    <div className="relative w-full h-full min-h-[150px]">
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && <div className="flex items-center justify-center">{icon}</div>}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm border rounded-xl">
          <span className="animate-pulse text-sm">Cargando…</span>
        </div>
      )}
    </div>
  )
}

