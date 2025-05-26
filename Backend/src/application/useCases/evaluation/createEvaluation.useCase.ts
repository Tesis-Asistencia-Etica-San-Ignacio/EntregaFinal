import {
  Evaluacion,
  IEvaluacionRepository,
  IEthicalNormRepository,
} from "../../../domain";
import { CreateEvaluacionDto } from "../..";

export class CreateEvaluacionUseCase {
  constructor(
    private readonly evaluacionRepository: IEvaluacionRepository,
  ) { }

  public async execute(data: CreateEvaluacionDto): Promise<Evaluacion> {
    const evaluacion = await this.evaluacionRepository.create(data);
    return {
      ...evaluacion,
      createdAt: new Date(evaluacion.createdAt),
      updatedAt: new Date(evaluacion.updatedAt),
    };
  }
}


