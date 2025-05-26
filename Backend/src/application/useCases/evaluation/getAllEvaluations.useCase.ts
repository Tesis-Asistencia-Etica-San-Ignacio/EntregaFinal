import { IEvaluacionRepository } from '../../../domain';
import { EvaluacionResponseDto } from '../..';

export class GetAllEvaluacionsUseCase {
  constructor(private readonly evaluacionRepository: IEvaluacionRepository) {}

  public async execute(): Promise<EvaluacionResponseDto[]> {
    return this.evaluacionRepository.findAll();
  }
}
