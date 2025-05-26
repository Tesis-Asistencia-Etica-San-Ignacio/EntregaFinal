import { updateGeminiClient } from "../../../infrastructure/config/geminiClient";
import { updateGroqClient } from "../../../infrastructure/config/groqClient";
import fs from 'fs/promises';
import path from 'path';

export class ModifyProviderApiKeyUseCase {
    async execute(provider: string, apiKey: string) {
        try {
            // Actualizar la configuración en memoria y regenerar cliente
            if (provider.toLowerCase() === 'gemini') {
                // Actualiza el cliente de Gemini directamente
                updateGeminiClient(apiKey);
                // También actualiza la variable de entorno para futuras referencias
                process.env.GEMINI_API_KEY = apiKey;
            } else if (provider.toLowerCase() === 'groq') {
                // Actualiza el cliente de Groq directamente
                updateGroqClient(apiKey);
                // También actualiza la variable de entorno para futuras referencias
                process.env.GROQ_API_KEY = apiKey;
            } else {
                throw new Error(`Proveedor no soportado: ${provider}`);
            }

            // seguir intentando persistir en .env
            // pero sin que sea crítico para el funcionamiento:
            try {
                const envFilePath = path.resolve(process.cwd(), '.env');
                let envVarName = provider.toLowerCase() === 'gemini' ? 'GEMINI_API_KEY' : 'GROQ_API_KEY';

                let currentEnvContent = '';
                try {
                    currentEnvContent = await fs.readFile(envFilePath, 'utf-8');
                } catch (err) {
                    if ((err as NodeJS.ErrnoException).code !== 'ENOENT')
                        console.log('Archivo .env no encontrado. No se persistirán los cambios.');
                    // No hacemos nada si el archivo no existe, ya que no es crítico
                    return provider;
                }

                // Si llegamos aquí, el archivo existe y podemos actualizarlo
                const regexPattern = new RegExp(`^${envVarName}\\s*=.*$`, 'm');
                let updatedEnvContent;

                if (regexPattern.test(currentEnvContent)) {
                    updatedEnvContent = currentEnvContent.replace(
                        regexPattern,
                        `${envVarName}=${apiKey}`
                    );
                } else {
                    updatedEnvContent = `${currentEnvContent}${currentEnvContent ? '\n' : ''}${envVarName}=${apiKey}`;
                }

                await fs.writeFile(envFilePath, updatedEnvContent, 'utf-8');
                console.log(`API key para ${provider} actualizada y persistida en .env`);
            } catch (error) {
                console.warn(`No se pudo persistir la API key en .env, pero el cliente fue actualizado:`, error);
                // No propagamos el error porque el cliente ya fue actualizado,
                // que es lo más importante para el funcionamiento
            }

            return provider;
        } catch (error) {
            console.error(`Error al actualizar la API key para hpta ${provider}:`, error);
            throw error;
        }
    }
}