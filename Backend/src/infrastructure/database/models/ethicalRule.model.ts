import { Schema, model, Document, Types } from "mongoose";

export interface EthicalNormDocument extends Document {
  _id: Types.ObjectId;
  evaluationId: Types.ObjectId;
  description: string;
  status: "APROBADO" | "NO_APROBADO" | "NO_APLICA";
  justification: string;
  cita: string;
  codeNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Crear el esquema
const EthicalNormSchema = new Schema<EthicalNormDocument>(
  {
    evaluationId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Evaluation" // Referencia a la colección de evaluaciones
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["APROBADO", "NO_APROBADO", "NO_APLICA"],
        message: "Estado inválido. Valores permitidos: APROBADO, NO_APROBADO"
      },
      required: [true, "El estado es requerido"]
    },
    justification: {
      type: String,
      maxlength: [10000, "La justificación no puede exceder los 10000 caracteres"],
      required: true
    },
    codeNumber: {
      type: String,
      required: true,
      unique: false
    },
    cita: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true // Genera automáticamente createdAt y updatedAt
  }
);

// 3. Crear índice compuesto para búsquedas frecuentes
EthicalNormSchema.index({ evaluationId: 1, status: 1 });

// 4. Middleware de validación previo a guardar
EthicalNormSchema.pre("save", function (next) {
  if (this.justification && this.status === "NO_APROBADO") {
    this.justification = "No se encontraron justificaciones"; // Limpiar justificación si está aprobada
    this.cita = "No se encontraron citas"; // Limpiar cita si está aprobada
  }
  next();
});

// 5. Exportar el modelo
export const EthicalNorm = model<EthicalNormDocument>(
  "EthicalNorm",
  EthicalNormSchema
);