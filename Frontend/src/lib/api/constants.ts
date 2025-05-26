export const QUERY_KEYS = {
    CASES: ['cases'] as const,
    EVALUATIONS: ['evaluations'] as const,
    ETHICAL_NORMS: (evaluationId: string) => ['ethicalNorms', evaluationId] as const,
    IA_PROVIDERS: ['iaProviders'] as const,
    ME: ['me'] as const,
    USERS: ['users'] as const,
    STATS: ['stats'] as const,
    PROMPTS: ['prompts'] as const,
};

export const DEFAULT_QUERY_OPTIONS = {
    staleTime: 1000 * 60 * 5,       // 5 minutos
    refetchOnMount: false,         // no refetch al montar
    refetchOnWindowFocus: false,   // ni al enfocar ventana
};