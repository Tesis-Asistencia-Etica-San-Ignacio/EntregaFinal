import { CaseModel } from '../..';
import { ICaseRepository } from '../../../domain';
import { 
  CreateCaseDto, 
  UpdateCaseDto, 
  CaseResponseDto } from '../../../application';
export class CaseRepository implements ICaseRepository {
  public async findAll(): Promise<CaseResponseDto[]> {
    const results = await CaseModel.find({});
    return results.map((doc) => ({
      id: doc._id.toString(),
      uid: doc.uid.toString(),
      nombre_proyecto: doc.nombre_proyecto,
      version: doc.version,
      codigo: doc.codigo,
      fecha: doc.fecha.toISOString(),
      pdf: doc.pdf,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));
  }

  public async findById(id: string): Promise<CaseResponseDto | null> {
    const doc = await CaseModel.findById(id);
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      uid: doc.uid.toString(),
      nombre_proyecto: doc.nombre_proyecto,
      version: doc.version,
      codigo: doc.codigo,
      pdf: doc.pdf,
      fecha: doc.fecha.toISOString(),
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  public async create(data: CreateCaseDto): Promise<CaseResponseDto> {
    const doc = await CaseModel.create(data);
    return {
      id: doc._id.toString(),
      uid: doc.uid.toString(),
      nombre_proyecto: doc.nombre_proyecto,
      version: doc.version,
      codigo: doc.codigo,
      pdf: doc.pdf,
      fecha: doc.fecha.toISOString(),
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  public async update(id: string, data: UpdateCaseDto): Promise<CaseResponseDto | null> {
    const doc = await CaseModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      uid: doc.uid.toString(),
      nombre_proyecto: doc.nombre_proyecto,
      version: doc.version,
      codigo: doc.codigo,
      pdf: doc.pdf,
      fecha: doc.fecha.toISOString(),
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  public async delete(id: string): Promise<boolean> {
    const doc = await CaseModel.findByIdAndDelete(id);
    return doc !== null;
  }

  public async findByUserId(userId: string): Promise<CaseResponseDto[]> {
    const results = await CaseModel.find({ uid: userId });
    return results.map((doc) => ({
      id: doc._id.toString(),
      uid: doc.uid.toString(),
      nombre_proyecto: doc.nombre_proyecto,
      version: doc.version,
      codigo: doc.codigo,
      pdf: doc.pdf,
      fecha: doc.fecha.toISOString(),
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));
  }

}