import { IEvaluacionRepository } from '../../../domain';
import { EvaluacionResponseDto } from '../..';

export class GetEvaluacionesByUserUseCase {
  constructor(private readonly evaluacionRepository: IEvaluacionRepository) {}

  public async execute(userId: string): Promise<EvaluacionResponseDto[]> {
    return this.evaluacionRepository.findByUserId(userId);
  }
}