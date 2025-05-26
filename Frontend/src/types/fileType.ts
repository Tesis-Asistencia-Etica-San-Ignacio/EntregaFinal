// Interfaz base que contiene las propiedades comunes de un archivo
export interface BaseFile {
    id?: string;
    name: string;
    size: number;
    url: string;
  }
  
  // Interfaz para representar un archivo en la lista (por ejemplo, después de haber sido subido)
  export type FileItem = BaseFile;
  
  // Interfaz para los archivos que se utilizan al subirlos, que incluyen propiedades adicionales
  export interface FileWithUrl extends BaseFile {
    file: File;  // Archivo que se subirá
    error?: boolean;
    progress: number;
  }
  
  // Parámetros para actualizar un archivo: reutilizamos las propiedades de la base
  export type UpdateFileParams = Pick<BaseFile, "id" | "name">;
  