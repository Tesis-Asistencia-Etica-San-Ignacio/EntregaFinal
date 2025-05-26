import { IStatsRepository } from '../../../domain'
import { EvaluationStatsDto } from '../../dtos'

export class GetEvaluationStatsUseCase {
    constructor(private statsRepository: IStatsRepository) { }

    execute(from: Date, to: Date): Promise<EvaluationStatsDto> {
        return this.statsRepository.aggregateEvaluationStats(from, to)
    }
}
