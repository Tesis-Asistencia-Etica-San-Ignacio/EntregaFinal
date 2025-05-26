import { IEthicalNormRepository } from "../../../domain/";

export class DeleteEthicalRuleUseCase {
  constructor(private readonly repository: IEthicalNormRepository) { }

  public async execute(id: string): Promise<boolean> {
    const exists = await this.repository.findById(id);
    if (!exists) throw new Error("Norma ética no encontrada");

    return this.repository.delete(id);
  }
}