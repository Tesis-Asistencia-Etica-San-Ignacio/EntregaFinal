import { Request, Response } from 'express'
import { SendEmailUseCase } from '../../application/useCases/smtp/smpt.useCase'
import { SmtpService } from '../../application/services/smpt.service'
import { PreviewPdfUseCase } from '../../application/useCases/pdf/previewPdf.useCase'
import { generateEmailHtml } from '../../shared/utils/emailTemplate'
import { sharedPreviewPdf } from '../../application/useCases/pdf/previewPdf.useCase'

export class SmtpController {
  private readonly sendEmailUseCase = new SendEmailUseCase(new SmtpService())
  private readonly previewPdfUseCase: PreviewPdfUseCase


  constructor() {
    // Creamos un PreviewPdfUseCase para que use el mismo caché de previews
    this.previewPdfUseCase = sharedPreviewPdf
  }

  public async sendEmail(req: Request, res: Response): Promise<void> {
    try {
      const {
        to,
        infoMail,
        evaluationId,
        modelo,
      } = req.body as {
        to: string | string[]
        infoMail: { subject: string; mensajeAdicional?: string; userType?: string }
        evaluationId: string
        modelo: string
      }

      // 1) Validaciones básicas
      if (!to || !infoMail?.subject || !evaluationId) {
        res.status(400).json({
          message: `Faltan datos. to: ${to}, subject: ${infoMail?.subject}, evaluationId: ${evaluationId}`,
        })
        return
      }

      // 2) Normalizar destinatarios
      const recipients = typeof to === 'string' ? [to.trim()] : to.map(t => t.trim())

      // 3) Nombre de usuario (igual que antes) …
      let userFullName: string | undefined
      if (req.user?.name && req.user?.last_name) {
        userFullName = `${req.user.name} ${req.user.last_name}`
      }
      if (!userFullName && req.user?.id) {
        const ud = await new (await import('../../application/useCases/user/getUserById.useCase')).GetUserByIdUseCase(
          new (await import('../../infrastructure/database/repositories/user.repository.impl')).UserRepository()
        ).execute(req.user.id)
        if (ud?.name && ud?.last_name) userFullName = `${ud.name} ${ud.last_name}`
      }
      if (!userFullName) {
        res.status(400).json({ message: 'No se pudo determinar nombre de usuario.' })
        return
      }

      // 4) Recuperar el pdfId que envía el front
      const pdfId = req.header('X-Pdf-Id')
      if (!pdfId) {
        res.status(400).json({ message: 'Falta el identificador del PDF (X-Pdf-Id)' })
        return
      }

      // 5) Leer del caché en vez de regenerar
      const buf = this.previewPdfUseCase.getBuffer(pdfId)
      if (!buf) {
        res.status(410).json({ message: 'El PDF ha expirado o no se encontró' })
        return
      }

      // 6) Generar HTML del correo
      const htmlContent = await generateEmailHtml({
        userName: userFullName,
        modelo,
        infoMail,
      })

      // 7) Enviar con el attachment del buffer cacheado
      await this.sendEmailUseCase.execute({
        to: recipients,
        subject: infoMail.subject.trim(),
        html: htmlContent,
        attachments: [
          {
            filename: 'reporte-normas.pdf',
            content: buf,
            contentType: 'application/pdf',
          },
        ],
      })

      // 8) (Opcional) limpiar caché
      this.previewPdfUseCase.clear(pdfId)

      res.status(200).json({ message: 'Correo enviado exitosamente.' })
    } catch (error) {
      console.error('Error al enviar el correo:', error)
      res.status(500).json({ message: 'Error al enviar el correo.' })
    }
  }
}
