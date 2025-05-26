import { v4 as uuidv4 } from 'uuid';
import { GeneratePdfUseCase } from './generatePdf.useCase';
import { PDFService } from '../../services/pdf.service';

/**
 * Use case que genera un PDF a partir de una plantilla y lo mantiene
 * en un caché temporal para ser reutilizado (preview, e-mail, guardado, etc.).
 * ───────────────────────────────────────────────────────────────
 * – execute ⇒ { buf, pdfId }
 * – getBuffer(pdfId) ⇒ Buffer | undefined
 * – clear(pdfId)     ⇒ void
 */
export class PreviewPdfUseCase {
    /** Mapa pdfId → Buffer; cada entrada vive 5 min */
    private readonly pdfCache = new Map<string, Buffer>();

    constructor(private readonly genPdf: GeneratePdfUseCase) { }

    /** Genera el PDF, lo guarda en caché y devuelve buffer + clave */
    public async execute(
        template: string,
        payload: Record<string, any>
    ): Promise<{ buf: Buffer; pdfId: string }> {
        const buf = await this.genPdf.execute(template, payload);

        const pdfId = uuidv4();
        this.pdfCache.set(pdfId, buf);

        // limpieza automática en 5 min
        setTimeout(() => this.pdfCache.delete(pdfId), 5 * 60 * 1000);

        return { buf, pdfId };
    }

    /** Devuelve el Buffer cacheado o undefined si ya no existe */
    public getBuffer(pdfId: string): Buffer | undefined {
        return this.pdfCache.get(pdfId);
    }

    /** Elimina manualmente una entrada del caché */
    public clear(pdfId: string): void {
        this.pdfCache.delete(pdfId);
    }
}

/* ------------------------------------------------------------------ */
/*  Instancia compartida para que TODA la app reutilice un único caché */
/* ------------------------------------------------------------------ */

const internalPdfGenerator = new GeneratePdfUseCase(new PDFService());
export const sharedPreviewPdf = new PreviewPdfUseCase(internalPdfGenerator);
