import { Request, Response, NextFunction } from "express";

import { GetAllCasesUseCase, GetCaseByIdUseCase, UpdateCaseUseCase, DeleteCaseUseCase, CreateCaseUseCase, GetCasesByUserIdUseCase } from "../../application/useCases/case";
import { sharedPreviewPdf } from "../../application/useCases/pdf/previewPdf.useCase";
import { uploadFileToMinio } from "../../application";
import { minioPublicUrl } from "../../infrastructure/config/minioClient";

export class CaseController {
  constructor(
    private readonly createCaseUseCase: CreateCaseUseCase,
    private readonly getAllCasesUseCase: GetAllCasesUseCase,
    private readonly getCaseByIdUseCase: GetCaseByIdUseCase,
    private readonly updateCaseUseCase: UpdateCaseUseCase,
    private readonly deleteCaseUseCase: DeleteCaseUseCase,
    private readonly getCasesByUserIdUseCase: GetCasesByUserIdUseCase,
  ) { }

  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const cases = await this.getAllCasesUseCase.execute();
      res.status(200).json(cases);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
    }
  };

  public getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const caseData = await this.getCaseByIdUseCase.execute(id);
      if (!caseData) {
        res.status(404).json({ message: "Caso no encontrado" });
      } else {
        res.status(200).json(caseData);
      }
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 1) Cabecera PDF
      const pdfId = req.header("X-Pdf-Id");
      if (!pdfId) {
        res.status(400).json({ success: false, message: "Falta el identificador del PDF (X-Pdf-Id)" });
        return;
      }

      // 2) Buffer cacheado
      const buf = sharedPreviewPdf.getBuffer(pdfId);
      if (!buf) {
        res.status(410).json({ success: false, message: "PDF expirado o no encontrado" });
        return;
      }

      // 3) Subir a MinIO
      const { nombre_proyecto, fecha, version, codigo } = req.body;
      const filename = `case_${codigo}_${Date.now()}.pdf`;
      const fileForMinio = {
        fieldname: "pdf",
        originalname: filename,
        encoding: "7bit",
        mimetype: "application/pdf",
        buffer: buf,
        size: buf.length,
      } as Express.Multer.File;

      await uploadFileToMinio(fileForMinio);
      const fileUrl = `${minioPublicUrl}/${filename}`;

      // 4) Crear el DTO usando req.user!.id directamente
      const nowIso = new Date().toISOString();
      const dto = {
        uid: req.user!.id,
        nombre_proyecto,
        fecha,
        version,
        codigo,
        pdf: fileUrl,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      // 5) Llamar al caso de uso
      const newCase = await this.createCaseUseCase.execute(dto);

      // 6) Limpiar caché
      sharedPreviewPdf.clear(pdfId);

      // 7) Responder
      res.status(201).json({ success: true, data: newCase });
    } catch (err) {
      next(err);
    }
  };

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedCase = await this.updateCaseUseCase.execute(id, req.body);
      if (!updatedCase) {
        res.status(404).json({ message: "Caso no encontrado" });
      } else {
        res.status(200).json(updatedCase);
      }
    } catch (error) {
      next(error);
    }
  };

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const wasDeleted = await this.deleteCaseUseCase.execute(id);
      if (!wasDeleted) {
        res.status(404).json({ message: "Caso no encontrado" });
      } else {
        res.status(200).json({ message: "Caso eliminado correctamente" });
      }
    } catch (error) {
      next(error);
    }
  };

  public getMyCases = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }
      const userId = req.user.id;
      const cases = await this.getCasesByUserIdUseCase.execute(userId);
      res.status(200).json(cases);
    } catch (error) {
      next(error);
    }
  };
}
