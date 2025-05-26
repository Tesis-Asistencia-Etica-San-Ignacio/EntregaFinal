import { promptModel } from '../..';
import { IPromptRepository } from '../../../domain';
import { PromptResponseDto, CreatepromptDto, UpdatepromptDto } from '../../../application';

export class PromptRepository implements IPromptRepository {
  public async findAll(): Promise<PromptResponseDto[]> {
    const results = await promptModel.find({});
    return results.map((doc) => ({
      id: doc._id.toString(),
      uid: doc.uid.toString(),
      nombre: doc.nombre,
      texto: doc.texto,
      codigo: doc.codigo,
      descripcion: doc.descripcion,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));
  }

  public async findById(id: string): Promise<PromptResponseDto | null> {
    const doc = await promptModel.findById(id);
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      uid: doc.uid.toString(),
      nombre: doc.nombre,
      texto: doc.texto,
      codigo: doc.codigo,
      descripcion: doc.descripcion,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  public async findByEvaluatorId(evaluatorId: string): Promise<PromptResponseDto[]> {
    const results = await promptModel.find({ uid: evaluatorId });
    return results.map((doc) => ({
      id: doc._id.toString(),
      uid: doc.uid.toString(),
      nombre: doc.nombre,
      texto: doc.texto,
      descripcion: doc.descripcion,
      codigo: doc.codigo,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));
  }


  public async create(data: Omit<CreatepromptDto, 'id'>): Promise<PromptResponseDto> {
    const doc = await promptModel.create(data);
    return {
      id: doc._id.toString(),
      uid: doc.uid.toString(),
      nombre: doc.nombre,
      texto: doc.texto,
      descripcion: doc.descripcion,
      codigo: doc.codigo,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  public async update(id: string, data: Partial<Omit<UpdatepromptDto, 'id'>>): Promise<PromptResponseDto | null> {
    const doc = await promptModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      uid: doc.uid.toString(),
      nombre: doc.nombre,
      texto: doc.texto,
      codigo: doc.codigo,
      descripcion: doc.descripcion,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  public async delete(id: string): Promise<boolean> {
    const result = await promptModel.findByIdAndDelete(id);
    return result !== null;
  }

  public async deleteByEvaluatorId(evaluationId: string): Promise<boolean> {
    const result = await promptModel.deleteMany({ uid: evaluationId });
    return result.deletedCount > 0;
  }
}
