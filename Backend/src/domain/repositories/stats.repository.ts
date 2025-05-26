import { EvaluationStatsDto } from '../../application/dtos/evaluationStats.dto'

export interface IStatsRepository {
    aggregateEvaluationStats(from: Date, to: Date): Promise<EvaluationStatsDto>
}