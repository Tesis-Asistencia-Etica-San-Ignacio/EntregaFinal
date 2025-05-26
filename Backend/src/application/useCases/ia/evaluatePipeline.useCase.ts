import { readPdfContent } from '../../../shared/utils/fileProcessor';
import { getAnalysisPrompt } from '../../prompts/analisis.prompt';
import { parseJson } from '../../../shared/utils/jsonParser';
import { IaOptionsDto } from '../../index';

import {
    GetEvaluacionByIdUseCase,
    GetEvaluacionesByUserUseCase,
    GetPromptsByEvaluatorIdUseCase,
    GenerateCompletionUseCase,
    deleteEthicalRulesByEvaluationIdUseCase,
    CreateEthicalRulesUseCase,
    UpdateEvaluacionUseCase,
    getFileByNameBuffer,
} from '../../index';

interface EvaluatePipelineDto {
    evaluatorId: string;
    evaluationId: string;
    cleanNormsBefore: boolean;
    model: string;
    provider: string;
    // false → primera evaluación
}

export class EvaluatePipelineUseCase {
    constructor(
        private readonly getEvalById: GetEvaluacionByIdUseCase,
        private readonly getEvalsByUser: GetEvaluacionesByUserUseCase,
        private readonly getPrompts: GetPromptsByEvaluatorIdUseCase,
        private readonly generateLLM: GenerateCompletionUseCase,
        private readonly deleteNorms: deleteEthicalRulesByEvaluationIdUseCase,
        private readonly createNorms: CreateEthicalRulesUseCase,
        private readonly updateEval: UpdateEvaluacionUseCase,
    ) { }

    public async execute(dto: EvaluatePipelineDto): Promise<void> {
        try {

            const { evaluatorId, evaluationId, cleanNormsBefore, model, provider } = dto;
            console.log("Info contolador IA", dto);

            /* 1 ─ Verificar que la evaluación pertenece al usuario */
            const evalsUser = await this.getEvalsByUser.execute(evaluatorId);
            const exists = evalsUser.some(e => e.id.toString() === evaluationId);
            if (!exists) throw new Error('Evaluación no encontrada para el usuario');

            /* 2 ─ Traer evaluación y validar estado */
            const evaluation = await this.getEvalById.execute(evaluationId);
            if (!evaluation) throw new Error('Evaluación no encontrada');
            if (!cleanNormsBefore && evaluation.estado !== 'PENDIENTE')
                throw new Error('La evaluación ya fue procesada');
            if (cleanNormsBefore &&
                !(evaluation.estado === 'EN CURSO' || evaluation.estado === 'EVALUADO'))
                throw new Error('Solo se puede re-evaluar si la evaluación está EN CURSO o EVALUADO');

            /* 3 ─ Obtener archivo desde MinIO */
            const fileName = evaluation.file.split('/').pop() || '';
            const fileBuffer = await getFileByNameBuffer(fileName);
            const fileContent = fileName.endsWith('.pdf')
                ? await readPdfContent(fileBuffer)
                : fileBuffer.toString();

            /* 4 ─ Obtener prompts personalizados del evaluador */
            const prompts = await this.getPrompts.execute(evaluatorId);
            if (!prompts) throw new Error('Prompts no encontrados para el evaluador');
            console.log('Prompts:', prompts);

            const { system, user } = getAnalysisPrompt(fileContent, prompts, provider);
            console.log('SYSTEM:', system, '\nUSER:', user);
            const IaMessage: IaOptionsDto = {
                model: model,
                systemInstruction: system,
                contents: user,
                responseType: { type: 'json_object' },
                temperature: 0.1,
                pdfBuffer: fileBuffer
            }

            /* 5 ─ Ejecutar modelo LLM */
            const completion = await this.generateLLM.execute(IaMessage, provider);
            console.log('Respuesta del modelo:', completion);
            console.log('Modelo:', model);
            console.log('Proveedor:', provider);
            if (!completion) throw new Error('Sin respuesta del modelo');
            const parsed = parseJson(completion);
            if (typeof parsed !== 'object' || !parsed.analysis)
                throw new Error('Formato JSON inválido');

            /* 6 ─ Lógica principal sin transacción */
            if (cleanNormsBefore) {
                await this.deleteNorms.execute(evaluation.id);
            }
            await this.createNorms.crearNormasEticasBase(evaluation.id, parsed.analysis,);
            await this.updateEval.execute(evaluation.id, { estado: 'EN CURSO' });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
