export type EthicalNormStatus = "APROBADO" | "NO_APROBADO" | "NO_APLICA";

export interface EthicalNorm {
  id: string;
  evaluationId: string;
  description: string;
  status: EthicalNormStatus;
  justification: string;
  cita: string;
  codeNumber: string;
  createdAt: Date;
  updatedAt: Date;
}