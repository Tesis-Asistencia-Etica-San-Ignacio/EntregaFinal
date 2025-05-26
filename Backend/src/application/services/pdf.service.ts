import ejs from 'ejs';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

export class PDFService {
  /**
   * @param templateName nombre de la plantilla EJS (sin extensión)
   * @param data objeto con los datos que inyectarás en la plantilla
   */
  public async generatePdf<T>(templateName: string, data: T): Promise<Buffer> {
    // 1) Ruta al EJS (asegúrate de copiar src/templates al contenedor)
    console.log('datadatadatadatadatadatadatadatadata', data);
    const templatePath = path.resolve(
      process.cwd(),
      'src', 'templates', 'pdf',
      `${templateName}.ejs`
    );

    // 2) Carga de logos desde dist/assets (relativo a dist/application/services)
    const logoHusiPath = path.resolve(
      __dirname,
      '..',  // /app/dist/application
      '..',  // /app/dist
      'assets',
      'logo-HUSI-ajustado-nuevo.png'
    );
    const logoPujPath = path.resolve(
      __dirname,
      '..',
      '..',
      'assets',
      'pontificia_universidad_javeriana_logo-320x130.jpg'
    );
    const logoHusiBase64 = fs.readFileSync(logoHusiPath).toString('base64');
    const logoPujBase64 = fs.readFileSync(logoPujPath).toString('base64');

    // 3) Render del HTML con EJS
    const htmlContent = await ejs.renderFile(templatePath, {
      ...data,
      logoHusiUri: `data:image/png;base64,${logoHusiBase64}`,
      logoPujUri: `data:image/jpeg;base64,${logoPujBase64}`,
    });

    // 4) Ruta al binario de Chromium del sistema (instalado vía apt)
    const chromePath = process.env.CHROME_PATH ?? '/usr/bin/chromium';

    // 5) Lanzamos Puppeteer usando ese Chromium
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: chromePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    // 6) Generamos el PDF
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'load' });
    const pdfBuffer = await Promise.race([
      page.pdf({ format: 'A4', printBackground: true }),
      new Promise<Buffer>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 60000)
      ),
    ]);

    await browser.close();
    return Buffer.from(pdfBuffer as Uint8Array);
  }
}
