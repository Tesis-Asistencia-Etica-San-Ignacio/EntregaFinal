import { EvaluationModel } from "../..";
import { IEvaluacionRepository } from "../../../domain";
import {
  CreateEvaluacionDto,
  UpdateEvaluacionDto,
  EvaluacionResponseDto,
} from "../../../application";

export type EstadoEvaluacion = 'PENDIENTE' | 'EN CURSO' | 'EVALUADO';

export class EvaluacionRepository implements IEvaluacionRepository {
  public async findAll(): Promise<EvaluacionResponseDto[]> {
    const results = await EvaluationModel.find({});
    return results.map((doc) => ({
      id: doc._id.toString(),
      uid: doc.uid.toString(),
      id_fundanet: doc.id_fundanet,
      file: doc.file,
      estado: doc.estado as EstadoEvaluacion,
      tipo_error: doc.tipo_error,
      aprobado: doc.aprobado,
      correo_estudiante: doc.correo_estudiante,
      version: doc.version,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));
  }

  public async findById(id: string): Promise<EvaluacionResponseDto | null> {
    const doc = await EvaluationModel.findById(id);
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      uid: doc.uid.toString(),
      id_fundanet: doc.id_fundanet,
      file: doc.file,
      estado: doc.estado as EstadoEvaluacion,
      tipo_error: doc.tipo_error,
      aprobado: doc.aprobado,
      correo_estudiante: doc.correo_estudiante,
      version: doc.version,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  public async create(
    data: CreateEvaluacionDto
  ): Promise<EvaluacionResponseDto> {
    const doc = await EvaluationModel.create(data);
    return {
      id: doc._id.toString(),
      uid: doc.uid.toString(),
      id_fundanet: doc.id_fundanet,
      file: doc.file,
      estado: doc.estado as EstadoEvaluacion,
      tipo_error: doc.tipo_error,
      aprobado: doc.aprobado,
      correo_estudiante: doc.correo_estudiante,
      version: doc.version,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  public async update(
    id: string,
    data: UpdateEvaluacionDto
  ): Promise<EvaluacionResponseDto | null> {
    const doc = await EvaluationModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      uid: doc.uid.toString(),
      id_fundanet: doc.id_fundanet,
      file: doc.file,
      estado: doc.estado as EstadoEvaluacion,
      tipo_error: doc.tipo_error,
      aprobado: doc.aprobado,
      correo_estudiante: doc.correo_estudiante,
      version: doc.version,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  public async delete(id: string): Promise<boolean> {
    const result = await EvaluationModel.findByIdAndDelete(id);
    return result !== null;
  }

  public async findByUserId(userId: string): Promise<EvaluacionResponseDto[]> {
    const results = await EvaluationModel.find({ uid: userId });
    return results.map((doc) => ({
      id: doc._id.toString(),
      uid: doc.uid.toString(),
      id_fundanet: doc.id_fundanet,
      file: doc.file,
      estado: doc.estado as EstadoEvaluacion,
      tipo_error: doc.tipo_error,
      aprobado: doc.aprobado,
      correo_estudiante: doc.correo_estudiante,
      version: doc.version,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));
  }

  public async findMaxVersionByFundaNet(idFundanet: string): Promise<number> {
    // Busca la evaluación con mayor versión
    const docs = await EvaluationModel
      .find({ id_fundanet: idFundanet })
      .sort({ version: -1 })
      .limit(1)
      .select('version')
      .lean();
    if (docs.length === 0) return 0;
    return docs[0].version;
  }
}
