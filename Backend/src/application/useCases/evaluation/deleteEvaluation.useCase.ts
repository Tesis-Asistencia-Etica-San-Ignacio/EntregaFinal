import { IEvaluacionRepository } from "../../../domain";
import { deleteFileFromMinio, deleteEthicalRulesByEvaluationIdUseCase } from "../../../application";

export class DeleteEvaluacionUseCase {
  constructor(private readonly evaluationRepository: IEvaluacionRepository, private readonly deleteEthicalRulesByEvaluationId: deleteEthicalRulesByEvaluationIdUseCase
  ) { }

  public async execute(evaluationId: string): Promise<boolean> {
    // 1. Recupera la evaluación desde la BD
    const evaluation = await this.evaluationRepository.findById(evaluationId);
    if (!evaluation) {
      return false;
    }

    await this.deleteEthicalRulesByEvaluationId.execute(evaluationId);

    // 2. Extraer la URL del archivo asociado
    // "http://localhost:9000/uploads/Taller4-LauraOvalle.pdf"
    const fileUrl: string = evaluation.file;

    // 3. Elimina la evaluación de la BD
    await this.evaluationRepository.delete(evaluationId);

    // 4. Extraer el nombre del objeto a partir de la URL
    // "http://localhost:9000/uploads/Taller4-LauraOvalle.pdf"
    // Extraemos "Taller4-LauraOvalle.pdf"
    const urlObj = new URL(fileUrl);
    // Si en tu bucket los objetos se guardan con su nombre original, puedes usar:
    const objectName = urlObj.pathname.substring(urlObj.pathname.lastIndexOf("/") + 1);

    // 5. Eliminar el archivo de min.io usando la función del servicio
    await deleteFileFromMinio(objectName);

    console.log("Evaluación y arcfhivo eliminados correctamente");
    return true;
  }
}
