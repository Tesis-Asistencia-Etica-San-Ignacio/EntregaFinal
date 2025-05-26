import path from 'path';
import fs from 'fs';
import { PromptSeed } from '../../types/promptSeed';
import type { IPromptRepository } from '../../domain/repositories/prompt.repository';

/**
 * Lee el JSON de seeds y crea los prompts para el evaluatorId dado.
 */
export async function seedPromptsForEvaluator(
  evaluatorId: string,
  promptRepo: IPromptRepository
): Promise<void> {
  const filePath = path.resolve(
    __dirname,
    '../../infrastructure/data/promptsSeed.json'
  );
  if (!fs.existsSync(filePath)) {
    throw new Error(`Archivo de seeds no encontrado: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  const seeds: PromptSeed[] = JSON.parse(raw);
  console.log("Seeds", seeds);

  await Promise.all(
    seeds.map(seed =>
      promptRepo.create({
        uid: evaluatorId,
        nombre: seed.nombre,
        texto: seed.texto,
        descripcion: seed.descripcion,
        codigo: seed.codigo
      })
    )
  );
}
