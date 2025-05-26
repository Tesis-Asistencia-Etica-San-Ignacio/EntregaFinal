export interface EthicalNormResponseDto {
    _id: string;
    evaluationId: string;
    description: string;
    status: string;
    codeNumber: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }


  export interface UpdateEthicalRuleParams {
    cita: string;
    status: "APROBADO" | "NO_APROBADO";
    justification: string;
  }
  export interface UpdateEthicalRuleResponseDto {
    _id: string;
    evaluationId: string;
    description: string;
    status: string;
    codeNumber: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
