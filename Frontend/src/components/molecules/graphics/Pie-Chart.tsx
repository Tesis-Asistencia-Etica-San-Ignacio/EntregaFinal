import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import type { PieSlice } from "@/types/statsTypes"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]
const RADIAN = Math.PI / 180
const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return (
        <text
            x={x}
            y={y}
            fill="#fff"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize="12px"
            fontWeight="bold"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}



export const PieChartComponent: React.FC<{
    data: PieSlice[]
    loading?: boolean
}> = ({ data, loading }) => {
    const [chartData, setChartData] = React.useState<PieSlice[]>(data)

    React.useEffect(() => {
        if (!loading) setChartData(data)
    }, [data, loading])

    return (
        <div className="relative flex flex-col items-center w-full">
            <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderLabel}
                        outerRadius="70%"
                        dataKey="value"
                        nameKey="label"
                    >
                        {chartData.map((_, idx) => (
                            <Cell
                                key={`cell-${idx}`}
                                fill={COLORS[idx % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    
                </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap justify-center mt-4">
                {chartData.map((entry, idx) => (
                    <div key={`legend-${idx}`} className="flex items-center mx-2">
                        <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: COLORS[idx] }}
                        />
                        <span className="text-sm font-medium">{entry.label}</span>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                    <span className="animate-pulse text-sm">Cargando…</span>
                </div>
            )}
        </div>
    )
}