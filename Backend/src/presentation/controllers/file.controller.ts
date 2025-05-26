import { Request, Response } from "express";
import {
  uploadFileToMinio,
  getAllFilesFromMinio,
  getFileByName,
  CreateEvaluacionUseCase,
} from "../../application";
import { EvaluacionRepository } from "../../infrastructure";
import dotenv from "dotenv";
import { minioClient } from "../../infrastructure/config/minioClient";
dotenv.config();

const BUCKET = process.env.MINIO_BUCKET ?? "uploads";

export const uploadFileController = async (req: Request, res: Response) => {
  console.log("Archivo recibido:", req.file);
  if (!req.file) return res.status(400).send("Archivo no enviado");

  try {
    // 1. Subir el archivo a MinIO
    await uploadFileToMinio(req.file);

    // 2. Construir la URL del archivo
    // Ajusta "config.minio.publicUrl" según tu configuración
    const fileUrl = `http://minio:9000/uploads/${req.file.originalname}`;

    // 3. Obtener el ID del evaluador desde req.user (asegúrate de que esté presente)
    const evaluatorId = req.user?.id;
    if (!evaluatorId) {
      console.error("No se pudo obtener el ID del evaluador");
      return res
        .status(401)
        .json({ message: "No se pudo obtener el ID del evaluador" });
    }

    // 4. Preparar los datos para la Evaluación
    // Debes incluir todos los campos requeridos según tu modelo:
    const evaluacionData = {
      uid: evaluatorId,
      id_fundanet: "Información de fundanet",
      file: fileUrl,
      fecha_inicial: new Date().toISOString(),
      fecha_final: new Date().toISOString(),
      estado: "PENDIENTE" as const, // Forzamos que sea uno de los valores permitidos
      tipo_error: "N/A",
      aprobado: false,
      correo_estudiante: "estudiante@ejemplo.com",
    };

    // 5. Crear la evaluación utilizando el use case
    const evaluacionRepository = new EvaluacionRepository();
    const createEvaluacionUseCase = new CreateEvaluacionUseCase(
      evaluacionRepository
    );
    const nuevaEvaluacion = await createEvaluacionUseCase.execute(
      evaluacionData
    );

    // 6. Responder al cliente
    return res.status(200).json({
      message: "Archivo subido a MIN.IO y evaluación creada correctamente",
      evaluacion: nuevaEvaluacion,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("Error al subir el archivo o crear la evaluación");
  }
};

export const getAllFilesController = async (req: Request, res: Response) => {
  try {
    const files = await getAllFilesFromMinio();
    return res.status(200).json(files);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener la lista de archivos");
  }
};

export const downloadPdfController = async (req: Request, res: Response) => {
  const { fileName } = req.params;
  if (!fileName) {
    return res.status(400).send("fileName es requerido");
  }

  try {
    // 1. Obtener el stream del objeto desde MinIO
    const objectStream = await minioClient.getObject(BUCKET, fileName);

    // 2. Fijar cabeceras para que el navegador muestre inline el PDF
    res.status(200).set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"`,
      "Cache-Control": "no-cache",
    });

    // 3. Pipe del stream de MinIO al response de Express
    objectStream.pipe(res);
  } catch (err: any) {
    console.error("Error descargando PDF:", err);
    if (err.code === "NoSuchKey") {
      return res.status(404).send("Archivo no encontrado");
    }
    return res.status(500).send("Error al descargar el archivo");
  }
};
