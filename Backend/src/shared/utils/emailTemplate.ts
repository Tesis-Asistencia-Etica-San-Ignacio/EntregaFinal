import ejs from 'ejs';
import path from 'path';

interface EmailTemplateData {
    userName: string;
    modelo: string;
    infoMail: {
        subject: string;
        mensajeAdicional?: string;
        telefono?: string;
        emailContacto?: string;
        direccion?: string;
        website?: string;
        template?: string;
    };
}

export async function generateEmailHtml({ userName, modelo, infoMail }: EmailTemplateData): Promise<string> {
    const defaultInfo = {
        telefono: "(601) 594 6161",
        emailContacto: "investigacion@husi.org.co",
        direccion: "Carrera 7 No. 40-62, Bogotá, Colombia",
        website: "https://www.husi.org.co",
        template: "documentTemplate.html"
    };

    const completeInfoMail = {
        subject: infoMail.subject,
        mensajeAdicional: infoMail.mensajeAdicional || "",
        telefono: defaultInfo.telefono,
        emailContacto: defaultInfo.emailContacto,
        direccion: defaultInfo.direccion,
        website: defaultInfo.website,
        template: defaultInfo.template
    };

    const templatePath = path.join(process.cwd(), 'src', 'templates', 'emails', completeInfoMail.template);
    return ejs.renderFile(templatePath, { userName, modelo, infoMail: completeInfoMail });
}
