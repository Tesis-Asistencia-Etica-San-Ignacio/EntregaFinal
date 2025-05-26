export interface Prompt {
    id: string;
    nombre: string;
    texto: string;
    descripcion: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
    codigo: string;
  }

  export interface UpdatePromptTextParams {
    texto: string;
  }