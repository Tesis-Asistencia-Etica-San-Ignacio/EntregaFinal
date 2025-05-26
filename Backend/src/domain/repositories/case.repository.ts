import { CreateCaseDto, UpdateCaseDto, CaseResponseDto } from '../../application';

export interface ICaseRepository {
  findAll(): Promise<CaseResponseDto[]>;
  findById(id: string): Promise<CaseResponseDto | null>;
  create(data: CreateCaseDto): Promise<CaseResponseDto>;
  update(id: string, data:UpdateCaseDto): Promise<CaseResponseDto | null>;
  delete(id: string): Promise<boolean>;
  findByUserId(userId: string): Promise<CaseResponseDto[]>
}