import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTheme } from "@/context/ThemeContext"
import AppearanceTemplate from "@/components/templates/settings/AppearanceTemplate"

const appearanceSchema = z.object({
  theme: z.enum(["light", "dark"]),
})

type AppearanceFormValues = z.infer<typeof appearanceSchema>

export default function AppearanceScreen() {
  const { theme, setTheme } = useTheme()

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      theme: theme as "light" | "dark",
    },
  })

  function onSubmit(data: AppearanceFormValues) {
    setTheme(data.theme)

  }

  return (
    <AppearanceTemplate
      title="Apariencia"
      desc="Personaliza la apariencia de la aplicación. Cambia automáticamente entre los temas diurno y nocturno."
      form={form}
      onSubmit={onSubmit}
    />
  )
}
