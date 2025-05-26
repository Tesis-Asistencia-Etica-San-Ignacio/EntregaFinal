import { Type, Static } from '@sinclair/typebox';

// Esquema para crear un caso
export const CreateCaseSchema = Type.Object({
  uid: Type.String({ pattern: '^[0-9a-fA-F]{24}$' }),
  nombre_proyecto: Type.String(),
  fecha: Type.String({ format: 'date-time' }),
  version: Type.String(),
  codigo: Type.String(),
  pdf: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

// Tipo para la creación de un caso
export type CreateCaseDto = Static<typeof CreateCaseSchema>;

// Esquema para la actualización parcial de un caso
export const UpdateCaseSchema = Type.Partial(CreateCaseSchema);
export type UpdateCaseDto = Static<typeof UpdateCaseSchema>;

export const CaseResponseSchema = Type.Object({
  id: Type.String(),
  uid: Type.String(),
  nombre_proyecto: Type.String(),
  fecha: Type.String({ format: 'date-time' }),
  version: Type.String(),
  codigo: Type.String(),
  pdf: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

// Tipo para la respuesta de caso
export type CaseResponseDto = Static<typeof CaseResponseSchema>;

// Esquema para una lista de casos
export const CasesListSchema = Type.Object({
  cases: Type.Array(CaseResponseSchema),
});
export type CasesListDto = Static<typeof CasesListSchema>;