import { IEvaluacionRepository, Evaluacion } from '../../../domain';
import { UpdateEvaluacionDto } from '../..';

export class UpdateEvaluacionUseCase {
  constructor(private readonly evaluacionRepository: IEvaluacionRepository) { }

  public async execute(id: string, data: UpdateEvaluacionDto): Promise<Evaluacion | null> {
    // 1. Carga la evaluación actual
    const existing = await this.evaluacionRepository.findById(id);
    if (!existing) return null;

    // 2. Si actualizan id_fundanet y es distinto
    if (data.id_fundanet && data.id_fundanet !== existing.id_fundanet) {
      const maxVersion = await this.evaluacionRepository.findMaxVersionByFundaNet(data.id_fundanet);
      // Asigna la versión siguiente
      data.version = maxVersion + 1;
    }
    // Si no cambió id_fundanet, version queda como estaba (o 1 por defecto si nunca se creó)

    // 3. Ejecuta el update normal
    const updatedDto = await this.evaluacionRepository.update(id, data);
    if (!updatedDto) return null;

    // 4. Convierte fechas y retorna el dominio
    return {
      ...updatedDto,
      createdAt: new Date(updatedDto.createdAt),
      updatedAt: new Date(updatedDto.updatedAt),
    };
  }
}
