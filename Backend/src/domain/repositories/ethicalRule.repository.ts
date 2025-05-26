import { EthicalNorm } from "../entities";
import {
  UpdateEthicalNormDto,
  EthicalNormResponseDto,
  CreateEthicalNormDto,
} from "../../application/";

export interface IEthicalNormRepository {
  findAll(): Promise<EthicalNormResponseDto[]>;
  findById(id: string): Promise<EthicalNormResponseDto | null>;
  create(data: Omit<CreateEthicalNormDto, "id">): Promise<EthicalNorm>;
  update(
    id: string,
    data: UpdateEthicalNormDto
  ): Promise<EthicalNormResponseDto | null>;
  delete(id: string): Promise<boolean>;
  findByEvaluationId(evaluationId: string): Promise<EthicalNormResponseDto[]>;
  deleteByEvaluationId(evaluationId: string): Promise<boolean>;
}