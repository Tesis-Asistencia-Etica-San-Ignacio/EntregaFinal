import { requestsApi } from '@/lib/api/requestsApi'
import type { EvaluationStatsDto } from '@/types/statsTypes'

export const getEvaluationStats = async (
    from: string,
    to: string
): Promise<EvaluationStatsDto> => {
    const { data } = await requestsApi.get<EvaluationStatsDto>('/stats/evaluations', {
        params: { from, to }
    })
    return data
}