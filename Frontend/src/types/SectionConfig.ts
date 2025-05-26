import type { DynamicFormHandles } from "@/components/molecules/Dynamic-form";
import { LTMatch } from "@/lib/api/languageApi";
import type { FormField } from "@/types/formTypes";

export interface SectionConfig {
    sectionKey: string;
    title: string;
    fields: FormField[];
    initialData: Record<string, any>;
    open: boolean;
    onToggle: () => void;
    formRef: React.RefObject<DynamicFormHandles>;
    onChange: (vals: Record<string, string>) => void;
    /** sólo para secciones dinámicas */
    dynamicFormKey?: string;
    /** opcionales si hay spellcheck */
    onSpellCheck?: (fieldKey: string, text: string) => void;
    spellingWarnings?: Record<string, LTMatch[]>;

}
