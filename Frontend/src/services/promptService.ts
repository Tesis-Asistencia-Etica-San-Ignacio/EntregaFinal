import { requestsApi } from "@/lib/api/requestsApi";
import type { Prompt, UpdatePromptTextParams } from "@/types/promptType";

export const updatePromptText = async (
  promptId: string,
  updateData: UpdatePromptTextParams
): Promise<void> => {
  await requestsApi.patch(`/prompts/${promptId}`, updateData, {
    headers: { "Content-Type": "application/json" },
  });
};

export const getMyPrompts = async (): Promise<Prompt[]> => {
  const { data } = await requestsApi.get("/prompts/my");
  return data;
};

export const resetMyPrompts = async (): Promise<void> => {
  await requestsApi.post("/prompts/my/reset-prompts");
};
