import React from "react";
import { Button } from "../atoms/ui/button";
import { SectionConfig } from "@/types/SectionConfig";
import { FormSection } from "../organisms/FormSection";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../atoms/ui/hover-card";

interface Props {
  /* cabecera */
  headerTitle: string;
  description: string;
  /* bloques JSX ya preparados por la pantalla */
  sections: SectionConfig[];
  /* extras opcionales */
  spellingWarnings?: React.ReactNode;
  modalForm?: React.ReactNode;
  /* submit viene de la Screen */
  onFormSubmit: () => void;
}

export const CreateCaseTemplate: React.FC<Props> = ({
  headerTitle,
  description,
  sections,
  spellingWarnings,
  modalForm,
  onFormSubmit,
}) => (
  <form onSubmit={(e) => {
    e.preventDefault(); onFormSubmit();
  }} className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-6">

    <h1 className="text-3xl font-bold text-center text-[#111827] dark:text-inherit">
      {headerTitle}
    </h1>

    <p className="text-center text-gray-500 dark:text-inherit">{description}</p>

    {sections.map(sec => (
      <FormSection
        key={sec.sectionKey}
        sectionKey={sec.sectionKey}
        title={sec.title}
        open={sec.open}
        onToggle={sec.onToggle}
        formRef={sec.formRef}
        fields={sec.fields}
        initialData={sec.initialData}
        onChange={sec.onChange}
        dynamicFormKey={sec.dynamicFormKey}
        onSpellCheck={sec.onSpellCheck}
        spellWarnings={sec.spellingWarnings}
      />
    ))}
    {/* Botón guardar */}
    <div className="flex justify-start">
      <HoverCard openDelay={500}>
        {/* El trigger: envuelve el botón */}
        <HoverCardTrigger asChild>
          <div className="inline-block">
            <Button type="submit">Previsualizar PDF</Button>
          </div>
        </HoverCardTrigger>

        {/* El contenido desplazado dentro de un portal para evitar desbordes */}
        <HoverCardContent
          side="top"
          align="start"
          sideOffset={8}
          className="max-w-sm p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800"
        >
          <h4 className="text-lg font-semibold mb-2">Requisitos de Previsualización</h4>
          <p className="text-sm mb-3">
            Para que el botón funcione, todas las secciones del formulario deben estar completamente expandidas; de lo contrario, la acción no estará disponible.
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>

    {/* Warnings ortográficos */}
    {spellingWarnings}

    {/* Modal PDF */}
    {modalForm}
  </form>
);

export default CreateCaseTemplate;