import { StatsGrid } from "@/components/organisms/Stats-grid"
import { DatePickerWithRange } from "../molecules/calendars/DateRangePicker"
import { Card, CardContent, CardHeader, CardTitle } from "../atoms/ui/card"
import { LineChartComponent } from "../molecules/graphics/Line-Chart"
import { PieChartComponent } from "../molecules/graphics/Pie-Chart"

import type { LinePoint, PieSlice, StatsCardProps } from "@/types/statsTypes"

export interface DashboardTemplateProps {
    readonly cardsData: StatsCardProps[]
    readonly lineSeries: LinePoint[]
    readonly pieSeries: PieSlice[]
    readonly range: { from: Date; to: Date }
    readonly onRangeChange: (range: { from: Date; to: Date }) => void
    readonly loading?: boolean
}

export default function DashboardTemplate({
    cardsData,
    lineSeries,
    pieSeries,
    range,
    onRangeChange,
    loading,
}: DashboardTemplateProps) {
    return (
        <section>
            <div className="flex items-center justify-between space-y-2 mb-3">
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <DatePickerWithRange
                        from={range.from}
                        to={range.to}
                        onChange={onRangeChange}
                    />
                </div>
            </div>
            <div className="space-y-4">
                <StatsGrid cards={cardsData} loading={loading} />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Evaluadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LineChartComponent data={lineSeries} loading={loading} />
                        </CardContent>
                    </Card>
                    <Card className="col-span-4 lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Proporción</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PieChartComponent data={pieSeries} loading={loading} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
