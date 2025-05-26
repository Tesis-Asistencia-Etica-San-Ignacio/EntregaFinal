import { Schema, model, Document, Types } from 'mongoose';

export interface EvaluationDocument extends Document {
  _id: Types.ObjectId;
  uid: Types.ObjectId;
  id_fundanet: string;
  file: string;
  estado: string;
  tipo_error: string;
  aprobado: boolean;
  correo_estudiante: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const EvaluationSchema = new Schema<EvaluationDocument>(
  {
    uid: { type: Schema.Types.ObjectId, ref: 'Usuarios', required: true },
    id_fundanet: { type: String, required: true },
    file: { type: String, required: true },
    estado: { type: String, required: true },
    tipo_error: { type: String, required: true },
    aprobado: { type: Boolean, required: true },
    correo_estudiante: { type: String, required: true },
    version: { type: Number, required: false, default: 1 },
  },
  {
    timestamps: true, // Maneja createdAt y updatedAt automáticamente
  }
);

export const EvaluationModel = model<EvaluationDocument>('Evaluaciones', EvaluationSchema);
