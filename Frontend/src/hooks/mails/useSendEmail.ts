import { useMutation } from "@tanstack/react-query";
import { sendEmail, SendEmailInput } from "@/services/emailService";
import { useNotify } from "@/hooks/useNotify";

export function useSendEmail() {
  const { notifySuccess, notifyError } = useNotify();

  return useMutation<void, unknown, SendEmailInput>({
    mutationFn: sendEmail,
    onSuccess: () => {
      notifySuccess({
        title: "Correo enviado correctamente",
        description: "El formulario se envió y el correo fue procesado con éxito.",
        icon: "✅",
        closeButton: true,
      });
    },
    onError: (error: any) => {
      console.error("Error al enviar email:", error);
      notifyError({
        title: "Error enviando correo",
        description: error?.message ?? "Ocurrió un problema al enviar el correo.",
        closeButton: true,
      });
    },
  });
}
