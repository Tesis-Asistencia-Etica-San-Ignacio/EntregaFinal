import { requestsApi } from "@/lib/api/requestsApi";

export interface IaProvider {
    provider: string
    models: string[]
}

export const generateEvaluation = async (evaluationId: string): Promise<void> => {
    await requestsApi.post(`/ia/evaluate`, { evaluationId }
    );
};

export const reEvaluateEvaluation = async (evaluationId: string): Promise<void> =>
    requestsApi.post("/ia/re-evaluate", { evaluationId });


export const updateApiKey = async (payload: { provider: string; apiKey: string }) => {
    await requestsApi.post('/ia/config/apikey', payload)
}

export const getIaProviders = async (): Promise<IaProvider[]> => {
    const { data } = await requestsApi.get<IaProvider[]>('/ia/models')
    return data
}
