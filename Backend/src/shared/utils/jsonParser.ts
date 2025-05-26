export function parseJson<T = any>(jsonString: string): T {
    try {
        // Intenta parsear directamente
        const parsed = JSON.parse(jsonString);
        // Si el resultado es un string (JSON doblemente codificado), parsear de nuevo
        if (typeof parsed === 'string') {
            return JSON.parse(parsed);
        }
        return parsed;
    } catch (error) {
        console.error('Error parsing JSON:', error);
        throw new Error('Formato de respuesta inválido');
    }
}