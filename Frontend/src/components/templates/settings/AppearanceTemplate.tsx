import { Button } from "@/components/atoms/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
  FormControl,
} from "@/components/atoms/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/atoms/ui/radio-group"
import ContentSection from "@/components/molecules/ContentSection"
import ThemeApp from "@/components/molecules/ThemeApp"

interface AppearanceTemplateProps {
  title: string
  desc: string
  form: any
  onSubmit: (data: any) => void
}

export default function AppearanceTemplate({
  title,
  desc,
  form,
  onSubmit,
}: AppearanceTemplateProps) {
  return (
    <ContentSection title={title} desc={desc}>
      <div className="lg:max-w-xl ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Tema</FormLabel>
                  <FormDescription>Seleccione el tema para la aplicación.</FormDescription>
                  <FormMessage />

                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid max-w-md grid-cols-2 gap-8 pt-2"
                  >
                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary flex flex-col items-center justify-center">
                        <FormControl>
                          <RadioGroupItem value="light" className="sr-only" />
                        </FormControl>
                        <ThemeApp variant="light" />
                        <span className="block w-full p-2 text-center font-normal">
                          Claro
                        </span>
                      </FormLabel>
                    </FormItem>

                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary flex flex-col items-center justify-center">
                        <FormControl>
                          <RadioGroupItem value="dark" className="sr-only" />
                        </FormControl>
                        <ThemeApp variant="dark" />
                        <span className="block w-full p-2 text-center font-normal">
                          Oscuro
                        </span>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormItem>
              )}
            />

            <Button type="submit">Actualizar preferencias</Button>
          </form>
        </Form>
      </div>
    </ContentSection>
  )
}
