import { requestsApi } from "@/lib/api/requestsApi";

export interface SendEmailInput {
  to: string;
  subject: string;
  mensajeAdicional?: string;
  evaluationId: string;
  modelo?: string;
  pdfId: string;
}

export async function sendEmail({
  to,
  subject,
  mensajeAdicional,
  evaluationId,
  modelo,
  pdfId,
}: SendEmailInput): Promise<void> {
  await requestsApi.post(
    "/smtp/send-email",
    { to, infoMail: { subject, mensajeAdicional }, evaluationId, modelo },
    {
      headers: { "X-Pdf-Id": pdfId },
    }
  );
}
