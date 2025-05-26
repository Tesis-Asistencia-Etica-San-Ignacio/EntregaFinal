import { Request, Response } from "express";
import { GetEthicalRulesByEvaluationUseCase } from "../../application/useCases/ethical_rules/getEthicalRulesByEvaluation.useCase";
import { EthicalNormRepository } from "../../infrastructure/database/repositories/ethicalRule.repository.impl";
import { GetEvaluacionByIdUseCase } from "../../application/useCases/evaluation/getEvaluationsById.useCase";
import { EvaluacionRepository } from "../../infrastructure/database/repositories/evaluation.repository.impl";
import { CreateCaseUseCase } from "../../application/useCases/case/createCase.useCase";
import { CaseRepository } from "../../infrastructure/database/repositories/case.repository.impl";
import { PreviewPdfUseCase } from "../../application/useCases/pdf/previewPdf.useCase";
import { sharedPreviewPdf } from '../../application/useCases/pdf/previewPdf.useCase'

export class PdfController {
  private readonly previewPdf: PreviewPdfUseCase;
  private readonly getNorms: GetEthicalRulesByEvaluationUseCase;
  private readonly getEval: GetEvaluacionByIdUseCase;
  private readonly createCase: CreateCaseUseCase;

  constructor() {
    this.previewPdf = sharedPreviewPdf;
    this.getNorms = new GetEthicalRulesByEvaluationUseCase(new EthicalNormRepository());
    this.getEval = new GetEvaluacionByIdUseCase(new EvaluacionRepository());
    this.createCase = new CreateCaseUseCase(new CaseRepository());
  }

  /** 1) Preview del informe de evaluador */
  public async previewEvaluatorPdf(req: Request, res: Response): Promise<void> {
    try {
      const { evaluationId } = req.body;
      if (!evaluationId) {
        res.status(400).send("evaluationId requerido");
        return;
      }

      const norms = await this.getNorms.execute(evaluationId);
      const evaluation = await this.getEval.execute(evaluationId);
      const version = evaluation?.version ?? 1;

      const { buf, pdfId } = await this.previewPdf.execute(
        "ethicalNormsReport",
        { norms, date: new Date().toLocaleDateString("es-CO"), version }
      );

      res
        .status(200)
        .set({
          "Content-Type": "application/pdf",
          "Content-Length": buf.length.toString(),
          "X-Pdf-Id": pdfId,
          "Access-Control-Expose-Headers": "X-Pdf-Id"
        })
        .send(buf);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error generando PDF de evaluador");
    }
  }

  /** 2) Preview del consentimiento del investigador */
  public async previewInvestigatorPdf(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const { nombre_proyecto, fecha, version, codigo } = data;
      if (!nombre_proyecto || !fecha || !version || !codigo) {
        res.status(400).send("Faltan campos obligatorios");
        return;
      }

      const { buf, pdfId } = await this.previewPdf.execute(
        "pdfConsentTemplate",
        {
          data,
          date: new Date().toLocaleDateString("es-CO")
        }
      );

      res
        .status(200)
        .set({
          "Content-Type": "application/pdf",
          "Content-Length": buf.length.toString(),
          "X-Pdf-Id": pdfId,
          "Access-Control-Expose-Headers": "X-Pdf-Id"
        })
        .send(buf);
    } catch (err) {
      console.error("❌ Error en previewInvestigatorPdf:", err);
      console.error(err instanceof Error ? err.stack : err);
      res.status(500).send("Error generando PDF de investigador");
    }
  }

}
