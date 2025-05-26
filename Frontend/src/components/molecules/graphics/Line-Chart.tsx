import {
    LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { LinePoint, LINE_COLORS } from '@/types/statsTypes';
import React from 'react';

export const LineChartComponent: React.FC<{
    data: LinePoint[];
    loading?: boolean;
}> = ({ data, loading }) => {
    const [chartData, setChartData] = React.useState<LinePoint[]>(data);

    React.useEffect(() => { if (!loading) setChartData(data); }, [data, loading]);

    /* Detectar series (todas las claves excepto “date”) */
    const keys = Object.keys(chartData[0] || {}).filter(k => k !== 'date') || ['evaluadas'];

    return (
        <div className="relative">
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {keys.map((key, i) => (
                        <Line key={key} type="monotone" dataKey={key}
                            stroke={LINE_COLORS[i % LINE_COLORS.length]}
                            activeDot={{ r: 8 }} />
                    ))}
                </LineChart>
            </ResponsiveContainer>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                    <span className="animate-pulse text-sm">Cargando…</span>
                </div>
            )}
        </div>
    );
};
