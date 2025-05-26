import { Type, Static } from '@sinclair/typebox';

// En tu diagrama, el estado de la evaluación puede ser "PENDIENTE", 
// "EN CURSO" o "EVALUADO".
export const ESTADO_EVALUACION = Type.Union([
  Type.Literal('PENDIENTE'),
  Type.Literal('EN CURSO'),
  Type.Literal('EVALUADO'),
]);


// Esquema para crear una Evaluacion
export const CreateEvaluacionSchema = Type.Object({
  uid: Type.String({ pattern: '^[0-9a-fA-F]{24}$' }), // Representa un ObjectId como string
  id_fundanet: Type.String(),
  file: Type.String(),
  estado: ESTADO_EVALUACION,
  tipo_error: Type.String(),
  aprobado: Type.Boolean(),
  correo_estudiante: Type.String(),
  version: Type.Optional(Type.Number()),
});

export type CreateEvaluacionDto = Static<typeof CreateEvaluacionSchema>;

// Esquema para actualizar una Evaluacion (todos los campos opcionales)
export const UpdateEvaluacionSchema = Type.Partial(CreateEvaluacionSchema);
export type UpdateEvaluacionDto = Static<typeof UpdateEvaluacionSchema>;

// Esquema para la respuesta de Evaluacion (excluyendo campos sensibles si los hubiera)
export const EvaluacionResponseSchema = Type.Object({
  id: Type.String(),
  uid: Type.String(),
  id_fundanet: Type.String(),
  file: Type.String(),
  estado: ESTADO_EVALUACION,
  tipo_error: Type.String(),
  aprobado: Type.Boolean(),
  correo_estudiante: Type.String(),
  version: Type.Number(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});
export type EvaluacionResponseDto = Static<typeof EvaluacionResponseSchema>;

// Esquema para una lista de evaluaciones
export const EvaluacionesListSchema = Type.Object({
  evaluaciones: Type.Array(EvaluacionResponseSchema),
});
export type EvaluacionesListDto = Static<typeof EvaluacionesListSchema>;
