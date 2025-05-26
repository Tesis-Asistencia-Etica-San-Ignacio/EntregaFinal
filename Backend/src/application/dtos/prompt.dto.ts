import { Type, Static } from '@sinclair/typebox';

export const CreatePromptSchema = Type.Object({
  uid: Type.String({ pattern: '^[0-9a-fA-F]{24}$' }),
  nombre: Type.String(),
  texto: Type.String(),
  descripcion: Type.String(),
  codigo: Type.String(),
  createdAt: Type.Optional(Type.Date()),
  updatedAt: Type.Optional(Type.Date()),
});
export type CreatepromptDto = Static<typeof CreatePromptSchema>;

export const UpdatepromptSchema = Type.Partial(CreatePromptSchema);
export type UpdatepromptDto = Static<typeof UpdatepromptSchema>;

export const PromptResponseSchema = Type.Object({
  id: Type.String(),
  uid: Type.String(),
  nombre: Type.String(),
  texto: Type.String(),
  codigo: Type.String(),
  descripcion: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});
export type PromptResponseDto = Static<typeof PromptResponseSchema>;
