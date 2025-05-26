import { EthicalNorm as EthicalNormModel } from "../models";
import { EthicalNorm, IEthicalNormRepository } from "../../../domain";
import { UpdateEthicalNormDto, EthicalNormResponseDto } from "../../../application";
import { Types } from "mongoose";

export class EthicalNormRepository implements IEthicalNormRepository {
  // Obtener todas las normas éticas
  public async findAll(): Promise<EthicalNormResponseDto[]> {
    const norms = await EthicalNormModel.find().lean();
    return norms.map(norm => this.toResponseDto(norm));
  }

  // Obtener norma por ID
  public async findById(id: string): Promise<EthicalNormResponseDto | null> {
    const norm = await EthicalNormModel.findById(id).lean();
    return norm ? this.toResponseDto(norm) : null;
  }

  // Crear nueva norma
  public async create(data: Omit<EthicalNorm, "id">): Promise<EthicalNorm> {
    const norm = await EthicalNormModel.create({
      ...data,
      evaluationId: new Types.ObjectId(data.evaluationId)
    });
    return this.toDomainEntity(norm.toObject());
  }

  // Actualizar norma existente
  public async update(
    id: string,
    data: UpdateEthicalNormDto
  ): Promise<EthicalNormResponseDto | null> {
    const updateData = data.evaluationId
      ? { ...data, evaluationId: new Types.ObjectId(data.evaluationId) }
      : data;

    const norm = await EthicalNormModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    return norm ? this.toResponseDto(norm) : null;
  }

  // Eliminar norma
  public async delete(id: string): Promise<boolean> {
    const result = await EthicalNormModel.findByIdAndDelete(id);
    return !!result;
  }

  // Buscar normas por ID de evaluación
  public async findByEvaluationId(evaluationId: string): Promise<EthicalNormResponseDto[]> {
    const norms = await EthicalNormModel.find({
      evaluationId: new Types.ObjectId(evaluationId)
    }).lean();

    return norms.map(norm => this.toResponseDto(norm));
  }

  public async deleteByEvaluationId(evaluationId: string): Promise<boolean> {
    const result = await EthicalNormModel.deleteMany({ evaluationId });
    return result.deletedCount > 0;
  }

  // Helpers para conversión de tipos
  private toResponseDto(norm: any): EthicalNormResponseDto {
    return {
      id: norm._id.toString(),
      evaluationId: norm.evaluationId.toString(),
      description: norm.description,
      status: norm.status,
      justification: norm.justification,
      cita: norm.cita,
      codeNumber: norm.codeNumber,
      createdAt: norm.createdAt,
      updatedAt: norm.updatedAt
    };
  }

  private toDomainEntity(norm: any): EthicalNorm {
    return {
      id: norm._id.toString(),
      evaluationId: norm.evaluationId.toString(),
      description: norm.description,
      status: norm.status,
      justification: norm.justification,
      cita: norm.cita,
      codeNumber: norm.codeNumber,
      createdAt: norm.createdAt,
      updatedAt: norm.updatedAt
    };
  }
}