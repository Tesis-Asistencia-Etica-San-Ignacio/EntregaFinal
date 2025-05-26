import { CreateEvaluacionDto, UpdateEvaluacionDto, EvaluacionResponseDto } from '../../application';

export interface IEvaluacionRepository {
  findAll(): Promise<EvaluacionResponseDto[]>;
  findById(id: string): Promise<EvaluacionResponseDto | null>;
  create(data: CreateEvaluacionDto): Promise<EvaluacionResponseDto>;
  update(id: string, data: UpdateEvaluacionDto): Promise<EvaluacionResponseDto | null>;
  delete(id: string): Promise<boolean>;
  findByUserId(userId: string): Promise<EvaluacionResponseDto[]>;
  findMaxVersionByFundaNet(idFundanet: string): Promise<number>;
}
