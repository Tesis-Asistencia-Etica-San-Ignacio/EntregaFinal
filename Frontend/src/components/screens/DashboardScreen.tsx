import { useMemo, useState } from 'react';
import { formatISO, subMonths, startOfDay } from 'date-fns';
import {
    ArrowUpRight,
    CheckCircle,
    XCircle,
    CalendarSync,
    Clock,
} from 'lucide-react';

import DashboardTemplate from '@/components/templates/DashBoardTemplate';
import { useGetEvaluationStats } from '@/hooks/stats/useGetEvaluationStats';
import {
    type LinePoint,
    type PieSlice,
    type EvaluationStatsDto,
} from '@/types/statsTypes';
import type { ReactNode } from 'react';

type MetricKey = keyof EvaluationStatsDto['cards'];
interface MetricConfig {
    key: MetricKey;
    title: string;
    icon: ReactNode;
    overrideDesc?: string;
}

const METRICS: MetricConfig[] = [
    { key: 'total', title: 'Total de consentimientos evaluados', icon: <CalendarSync className="h-4 w-4 text-muted-foreground" /> },
    { key: 'aprobados', title: 'Consentimientos aprobados', icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
    { key: 'rechazados', title: 'Consentimientos rechazados', icon: <XCircle className="h-4 w-4 text-red-500" /> },
    { key: 'tasaDevolucion', title: 'Tasa de devolución', icon: <ArrowUpRight className="h-4 w-4 text-blue-500" /> },
    { key: 'tiempoPromedio', title: 'Tiempo promedio de evaluación', icon: <Clock className="h-4 w-4 text-muted-foreground" />, overrideDesc: 'Este valor es general' },
];

const formatDelta = (now: number, prev: number) => {
    const diff = now - prev;
    const pct = prev ? (diff / prev) * 100 : 0;
    const sign = diff >= 0 ? '+' : '';
    return `${sign}${pct.toFixed(1)}% vs mes anterior`;
};

export default function DashboardScreen() {
    const [range, setRange] = useState({
        from: startOfDay(subMonths(new Date(), 1)),
        to: startOfDay(new Date()),
    });

    const { data, isLoading } = useGetEvaluationStats(
        formatISO(range.from, { representation: 'date' }),
        formatISO(range.to, { representation: 'date' }),
    );

    const cardsData = useMemo(() => {
        if (!data) return [];
        return METRICS.map(({ key, title, icon, overrideDesc }) => {
            let { value, previousValue } = data.cards[key];

            // ajusta porcentaje
            if (key === 'tasaDevolucion') {
                value *= 100;
                previousValue = previousValue != null ? previousValue * 100 : 0;
            }

            const displayValue = key === 'tasaDevolucion'
                ? `${value.toFixed(1)} %`
                : value.toLocaleString();

            const description = overrideDesc
                ?? (previousValue != null
                    ? formatDelta(value, previousValue)
                    : undefined);

            return { title, value: displayValue, previousValue, description, icon, loading: isLoading };
        });
    }, [data, isLoading]);

    const lineSeries: LinePoint[] = data?.lineSeries ?? [];
    const pieSeries: PieSlice[] = data?.pieSeries ?? [];
    console.log('lineSeries', lineSeries);

    return (
        <DashboardTemplate
            cardsData={cardsData}
            lineSeries={lineSeries}
            pieSeries={pieSeries}
            range={range}
            onRangeChange={setRange}
            loading={isLoading}
        />
    );
}
