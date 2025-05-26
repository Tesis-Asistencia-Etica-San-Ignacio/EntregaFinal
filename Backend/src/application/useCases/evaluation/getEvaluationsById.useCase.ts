import { IEvaluacionRepository } from '../../../domain';
import { EvaluacionResponseDto } from '../..';

export class GetEvaluacionByIdUseCase {
  constructor(private readonly evaluacionRepository: IEvaluacionRepository) {}

  public async execute(id: string): Promise<EvaluacionResponseDto | null> {
    return this.evaluacionRepository.findById(id);
  }
}
