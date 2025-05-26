import { Schema, model, Document, Types } from "mongoose";

export interface CaseDocument extends Document {
  _id: Types.ObjectId;
  uid: Types.ObjectId;
  nombre_proyecto: string;
  fecha: Date;
  version: string;
  codigo: string;
  pdf: string;
  createdAt: Date;
  updatedAt: Date;
}

const CaseSchema = new Schema<CaseDocument>(
  {
    uid: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    nombre_proyecto: { type: String, required: true },
    fecha: { type: Date },
    pdf: { type: String, required: true },
    version: { type: String, required: true },
    codigo: { type: String, required: true },
  },
  {
    timestamps: true, // crea createdAt y updatedAt automáticamente
  }
);

export const CaseModel = model<CaseDocument>("Cases", CaseSchema);
