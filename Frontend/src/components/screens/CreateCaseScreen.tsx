import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CreateCaseTemplate } from "@/components/templates/CreateCaseTemplate";
import { DynamicFormHandles } from "@/components/molecules/Dynamic-form";
import ModalForm from "@/components/organisms/dialogs/ModalForm";
import PdfRenderer from "@/components/organisms/PdfRenderer";

import type { FormField } from "@/types/formTypes";
import { FormField as ShadcnFormField, FormControl, FormItem, FormMessage } from "../atoms/ui/form"
import useGeneratePdfInvestigator from "@/hooks/pdf/useGeneratePdfByInvestigator";
import useCreateCaseHook from "@/hooks/cases/useCreateCases";
import { checkSpellingWithLT, LTMatch } from "@/lib/api/languageApi";
import { Input } from "../atoms/ui/input-form";
import { pick } from "lodash";
import { SectionConfig } from "@/types/SectionConfig";
import { useNavigate } from "react-router-dom";

/* ────────────── constantes para localStorage ────────────── */
const LS_KEY = "caseDraft";

export default function CreateCaseScreen() {
  /* -------- Hooks pdf -------- */
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const { fetchPdfInvestigator, pdfId, pdfUrl, loading, clearPdf } = useGeneratePdfInvestigator();
  const { createCase } = useCreateCaseHook();
  const navigate = useNavigate();

  /* -------- borrador almacenado -------- */
  const stored = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}");
    } catch {
      return {};
    }
  }, []);
  /* -------- React-Hook-Form -------- */
  const methods = useForm<Record<string, any>>({
    defaultValues: {
      genero_doctor: "",
      clasificacion_riesgo: "",
      tipo_poblacion: "",
      tipo_estudio: "",
      ...stored,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  /* -------- Refs de DynamicForm -------- */
  const cabeceraRef = useRef<DynamicFormHandles>(null!);
  const introRef = useRef<DynamicFormHandles>(null!);
  const infoRef = useRef<DynamicFormHandles>(null!);
  const authRef = useRef<DynamicFormHandles>(null!);

  /* -------- State de secciones y ortografía -------- */
  const [fecha] = useState<Date>();
  const [openSections, setOpen] = useState({ head: false,intro: false, info: false, auth: false });
  const [spellingWarnings, setWarn] = useState<Record<string, LTMatch[]>>({});
  // arriba, junto a los demás estados
  const [formData, setFormData] = useState<Record<string, any> | null>(null);



  const { watch } = methods;
  const genero = watch("genero_doctor");

  const clasificacionRiesgo = methods.watch("clasificacion_riesgo") ?? "";
  const tipoPoblacion = methods.watch("tipo_poblacion") ?? "";
  const tipoEstudio = methods.watch("tipo_estudio") ?? "";

  const mostrarAsentimiento = ["menores", "discapacitados"].includes(tipoPoblacion);

  const mostrarPoliza = clasificacionRiesgo === "riesgo_mayor" || (tipoEstudio === "intervencion_medica" || tipoEstudio === "intervencion_muestras");

  const sufijo = genero === "Femenino" ? "investigadora" : "investigador";
  const tituloDoc = genero === "Femenino" ? "Dra." : "Dr.";

  /* ─────────── Handlers auxiliares ────────── */
  const toggle = (k: keyof typeof openSections) => setOpen(p => ({ ...p, [k]: !p[k] }));

  const onSectionChange = (vals: Record<string, string>) => {
    Object.entries(vals).forEach(([k, v]) =>
      methods.setValue(k, v, { shouldDirty: true, shouldTouch: true })
    );
  };
  const onSpellCheck = (k: string, matches: LTMatch[]) => setWarn(p => ({ ...p, [k]: matches }));


  /* ───────────────────────── Persistencia auto a localStorage ───────────────────────── */

  useEffect(() => {
    if (!pdfModalOpen || !formData) return
    fetchPdfInvestigator(formData)
    console.log("✅ Preview generado, pdfId =", pdfId);
  }, [pdfModalOpen, formData, fetchPdfInvestigator])



  useEffect(() => {
    const sub = methods.watch((all) =>
      localStorage.setItem(LS_KEY, JSON.stringify(all))
    );
    return () => sub.unsubscribe();
  }, [methods]);

  const doSpellCheck = async (k: string, txt: string) => {
    if (!txt.trim()) return;
    try { onSpellCheck(k, await checkSpellingWithLT(txt)); } catch (e) { console.error(e); }
  };
  const handleSpellCheck = (fieldKey: string, matches: LTMatch[]) => {
    setWarn(prev => ({ ...prev, [fieldKey]: matches }))
  }

  /* ─────────── Submit (genera PDF) ────────── */
  const handleSubmit = async () => {
    /* validar formulario externo */
    if (!(await methods.trigger())) return;

    /* validar cada sección */
    const refs = [cabeceraRef, introRef, infoRef, authRef];
    const allOk = await Promise.all(refs.map(r => r.current?.trigger())).then(bools => bools.every(Boolean));
    if (!allOk) return;

    /* recolectar */
    const data: Record<string, any> = { fecha, ...methods.getValues() };

    for (const r of refs) {
      const inst = (r.current as any)?.__formInstance;
      if (inst) {
        await inst.trigger();
        Object.assign(data, inst.getValues());
      }
    }
    setFormData(data);
    setPdfModalOpen(true);
  };


  const handleModalSubmit = async () => {
    if (!formData) return;
    // Aquí pasamos formData **y** pdfId al hook de creación
    await createCase(formData, pdfId);
    // Limpieza
    navigate(`/historial-casos`);
    localStorage.removeItem(LS_KEY);
    clearPdf();
    setPdfModalOpen(false);
  };

  /* ───────────────────────── Campos (formDataConfig) ─────────────────────── */
  const cabeceraFields: FormField[] = [
    { key: "version", type: "number", label: "Versión", placeholder: "Ingresa la versión del FCI", required: true },
    { key: "codigo", type: "text", label: "Código", placeholder: "Ingresa el código del FCI", required: false },
    { key: "fecha", type: "datePicker", label: "Fecha", placeholder: "Ingresa una fecha", required: true },
  ];

  const introduccionFields: FormField[] = [
    { key: "nombre_proyecto", type: "text", label: "Nombre del Proyecto", placeholder: "Ingrese el nombre", required: true },
    { key: "instituciones", type: "text", label: "Institución(es) Participantes", placeholder: "Nombre institución", required: true },
  ];
  const informacionGeneralFields: FormField[] = useMemo(() => {
    let idx = 1;
    const fields: FormField[] = [];
    fields.push({
      key: "clasificacion_riesgo",
      type: "select",
      label: `${idx++}. Clasificación del riesgo`,
      options: [
        { value: "sin_riesgo", label: "Sin riesgo" },
        { value: "riesgo_minimo", label: "Riesgo mínimo" },
        { value: "riesgo_mayor", label: "Riesgo mayor que el mínimo" },
      ],
      placeholder: "Seleccione una opción",
      required: true,
    } as FormField);
    fields.push({
      key: "tipo_poblacion",
      type: "select",
      label: `${idx++}. Tipo de población`,
      options: [
        { value: "adultos", label: "Adultos mayores de 18 años" },
        { value: "menores", label: "Menores de edad" },
        { value: "discapacitados", label: "Adulto mayor con requerimiento de representante legal" },
      ],
      placeholder: "Seleccione una opción",
      required: true,
    } as FormField);
    fields.push({
      key: "tipo_estudio",
      type: "select",
      label: `${idx++}. Tipo de estudio`,
      options: [
        { value: "observacional_retrospectivo", label: "Observacional (retrospectivo)" },
        { value: "observacional_prospectivo", label: "Observacional (prospectivo)" },
        { value: "intervencion_psicosocial", label: "Intervención (psicosocial, encuestas, etc.)" },
        { value: "intervencion_muestras", label: "Intervención (toma de muestras biológicas)" },
        { value: "intervencion_medica", label: "Intervención (medicamentos, dispositivos...)" },
      ],
      placeholder: "Seleccione una opción",
      required: true,
    } as FormField);

    fields.push({
      key: "problema",
      type: "textarea",
      label: `${idx++}. ¿Por qué se debe realizar este estudio?`,
      placeholder: "Describa brevemente el problema y la pertinencia del estudio",
      required: true,
      autoAdjust: true

    } as FormField);
    fields.push({
      key: "objetivo",
      type: "textarea",
      label: `${idx++}. ¿Cuál es el objetivo de este estudio?`,
      placeholder: "Enuncie el objetivo general",
      required: true,
      autoAdjust: true
    } as FormField);
    fields.push({
      key: "def_estudio",
      type: "textarea",
      label: `${idx++}. ¿En qué consiste el estudio?`,
      placeholder: "Describa de manera clara y sencilla los procedimientos, intervenciones y su propósito, incluyendo los experimentales (aleatorización, cegamiento, uso de placebo, etc.). ",
      required: true,
      autoAdjust: true
    } as FormField);
    fields.push({
      key: "riesgos",
      type: "textarea",
      label: `${idx++}. ¿Cuáles son las molestias o los riesgos esperados?`,
      placeholder: "Describir molestias y riesgos. En caso de que no existan molestias o riesgos igualmente se debe informar.",
      required: true,
      autoAdjust: true
    } as FormField);
    fields.push({
      key: "beneficios",
      type: "textarea",
      label: `${idx++}.	¿Cuáles son los beneficios que puedo obtener por participar? Enunciar. `,
      placeholder: "Enunciar beneficios. En caso de que no existan beneficios igualmente se debe informar. ",
      required: true,
      autoAdjust: true
    } as FormField);
    fields.push({
      key: "confidencialidad",
      type: "textarea",
      label: `${idx++}.	¿Existe confidencialidad en el manejo de mis datos? Este proyecto se acoge a la ley 1581 de 2012 (Hábeas Data) que aplica para el tratamiento de datos personales.`,
      placeholder:
        "Indique brevemente cómo se manejarán los datos: Describa en dónde se almacenarán los datos e información, los mecanismos de custodia y seguridad de los mismos y el tiempo de custodia Describa quiénes tendrán acceso a la información y bajo qué parámetros de seguridad se accederá a ello Describa cómo se llevará a cabo la anonimización de los datos tanto para los análisis como para la publicación de los resultados. Describa la posibilidad de conocer los datos personales registrados en la base de datos del estudio, solicitar rectificación de los mismos y de retirar su consentimiento para el tratamiento de los datos en cualquier momento del estudio, excepto a partir de la anonimización.  -  Describa los procesos de transferencia de datos a terceros, en caso de estudios colaborativos, y la garantía de mantener la privacidad, confidencialidad y seguridad en el tratamiento por parte del tercero.",
      required: true,
      autoAdjust: true
    } as FormField);
    fields.push({
      key: "p_alternativos",
      type: "textarea",
      label: `${idx++}.	¿Existen procedimientos alternativos que pudieran ser ventajosos para mi?`,
      placeholder: "En caso de que se realicen intervenciones con dispositivos, procedimiento médico-quirúrgico o medicamentos explicar si existen otras intervenciones que puedan realizarse para la patología del paciente. ",
      required: true,
      autoAdjust: true
    } as FormField);
    fields.push({
      key: "compromiso_info",
      type: "textarea",
      label:
        `${idx++}.  Expresar el compromiso de proporcionar información actualizada obtenida durante el estudio, aunque ésta pudiera afectar la voluntad del sujeto para continuar participando.`,
      placeholder:
        "En caso de realización de estudios que requieran entrega de resultados de procedimiento o consejería (genética, por ejemplo), explicar el proceso.",
      required: true,
      autoAdjust: true
    } as FormField);
    fields.push({
      key: "ob_financiera",
      type: "textarea",
      label: `${idx++}.	¿Existe alguna obligación financiera? Participar en este estudio no tiene ningún costo económico para usted.`,
      placeholder: "En caso contrario, enunciar costos generados por participar en el estudio, describir cuáles: transporte, alimentación etc. y la forma cómo serán asumidos con cargo al presupuesto del proyecto. ",
      required: true,
      autoAdjust: true
    } as FormField);
    fields.push({
      key: "duracion",
      type: "textarea",
      label: `${idx++}. ¿Cuánto tiempo durará mi participación en el estudio? `,
      placeholder: "Indique el tiempo de participación y en caso de ser necesario la frecuencia de las intervenciones. ",
      required: true,
      autoAdjust: true
    } as FormField);
    fields.push({
      key: "afectaciones",
      type: "textarea",
      label: `${idx++}. ¿Qué sucede si no deseo participa o me retiro del estudio? Usted puede decidir no participar o retirarse en cualquier momento del estudio, sin que esto afecte de manera alguna el tratamiento médico que necesita. `,
      placeholder:
        "Indique que el retiro no afecta derechos ni tratamientos",
      required: true,
      autoAdjust: true
    } as FormField);

    if (mostrarAsentimiento) {
      fields.push({
        key: "asentimiento_informado",
        type: "textarea",
        label: `${idx++}. Al menor de edad o la persona que usted representa se le solicitará informar su aceptación para ingresar al estudio a través de un Asentimiento Informado.  De acuerdo a la Resolución 8430 de 1993, el proceso de asentimiento debe estar precedido de una valoración de razonamiento entendimiento y lógica realizada por un psicólogo, neurólogo o psiquiatra.  A través de este documento se solicita su autorización para realizar la valoración.`,
        placeholder:
          "En estudios en los que se involucran menores de edad o discapacitados físicos y mentales adultos, que propongan intervenciones o procedimientos que superan el riesgo mínimo (no hacen parte del estándar de manejo), se debe evaluar la capacidad de entendimiento de acuerdo a la Res. 8430 de 1993. ",
        required: true,
        autoAdjust: true
      } as FormField);
    }
    if (mostrarPoliza) {
      fields.push({
        key: "riesgo_salud_poliza",
        type: "textarea",
        label:
          `${idx++}. ¿Qué sucede si esta investigación afecta directamente mi salud?`,
        placeholder:
          "En estudios en los que se involucran menores de edad o discapacitados físicos y mentales adultos, que propongan intervenciones o procedimientos que superan el riesgo mínimo (no hacen parte del estándar de manejo), se debe evaluar la capacidad de entendimiento de acuerdo a la Res. 8430 de 1993. (Mantener o retirar el numeral 12 de acuerdo a la naturaleza del estudio)",
        required: true,
        autoAdjust: true
      } as FormField);
    }
    fields.push({
      key: "patrocinador",
      type: "text",
      required: true,
      hidden: true,
    } as FormField);
    fields.push({
      key: "compania_seguro",
      type: "text",
      required: true,
      hidden: true,
    } as FormField);
    fields.push({
      key: "dir_seguro",
      type: "text",
      required: true,
      hidden: true,
    } as FormField);
    fields.push({
      key: "genero_doctor",
      type: "select",
      required: true,
      hidden: true,
      options: [
        { value: "Masculino", label: "Masculino" },
        { value: "Femenino", label: "Femenino" },
      ],
    } as FormField);
    fields.push({
      key: "nombre_doctor",
      type: "text",
      required: true,
      hidden: true,
    } as FormField);
    fields.push({
      key: "cel_doctor",
      type: "number",
      required: true,
      hidden: true,
    },
      {
        key: "nombre_dir_investigaciones",
        type: "text",
        required: true,
        hidden: true,
      },
      {
        key: "cel_correo_dir_investigaciones",
        type: "text",
        required: true,
        hidden: true,
      } as FormField);
    fields.push({
      key: "textoLegal",
      type: "custom",
      component: (
        <div className="text-sm text-gray-700 dark:text-foreground leading-[2] space-y-3 border-t pt-4 mt-4">
          <div>
            Si bien es poco probable que se produzca una lesión, el/la{" "}
            <ShadcnFormField
              name="patrocinador"
              render={({ field }) => (
                <FormItem className="inline-block">
                  <FormControl>
                    <Input
                      {...field}
                      inputType="text"
                      placeholder="Nombre del patrocinador"
                      className="inline text-sm px-1 py-[2px] h-6 border rounded-md"
                      onBlur={(e) => doSpellCheck("patrocinador", e.target.value,)}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />{" "}
            realizará el pago de los gastos médicos relacionados con una lesión directamente causada por medicamentos administrados o procedimientos realizados en esta investigación al centro hospitalario del estudio, y el centro del estudio le proporcionará el tratamiento médico sin costo alguno para usted o para el sistema de salud.
          </div>
          <div>
            Para garantizar la cobertura cobertura de los riesgos o los posibles daños y lesiones y la atención adecuada que pueda surgir del estudio, {" "}
            <ShadcnFormField
              name="patrocinador"
              render={({ field }) => (
                <FormItem className="inline-block">
                  <FormControl>
                    <Input
                      {...field}
                      inputType="text"
                      placeholder="Nombre del patrocinador"
                      className="inline text-sm px-1 py-[2px] h-6 border rounded-md"
                      onBlur={(e) => doSpellCheck("patrocinador", e.target.value,)}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />{" "}
            ha contratado un seguro con la compañía{" "}
            <ShadcnFormField
              name="compania_seguro"
              render={({ field }) => (
                <FormItem className="inline-block">
                  <FormControl>
                    <Input
                      {...field}
                      inputType="text"
                      placeholder="Nombre de la compañía"
                      className="inline text-sm px-1 py-[2px] h-6 border rounded-md"
                      onBlur={async (e) => {
                        const texto = (e.target as HTMLInputElement).value;
                        const matches: LTMatch[] = await checkSpellingWithLT(texto);
                        handleSpellCheck("compania_seguro", matches);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />{" "}
            con dirección en {" "}
            <ShadcnFormField
              name="dir_seguro"
              render={({ field }) => (
                <FormItem className="inline-block">
                  <FormControl>
                    <Input
                      {...field}
                      inputType="text"
                      placeholder="Dirección"
                      className="inline text-sm px-1 py-[2px] h-6 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />
            .
          </div>
          <div>
            En caso que necesite información o emergencia, póngase en contacto con{" "}
            <ShadcnFormField

              name="genero_doctor"
              render={({ field }) => (
                <FormItem className="inline-block">
                  <FormControl>
                    <select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        methods.setValue("genero_doctor", e.target.value, {
                          shouldValidate: false,
                        })
                      }}
                      className="inline text-sm px-1 py-[2px] h-6 border rounded-md"
                    >
                      <option value=""></option>
                      <option value="Masculino">el</option>
                      <option value="Femenino">la</option>
                    </select>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />{" "}
            {sufijo} del estudio {tituloDoc}{" "}
            <ShadcnFormField
              name="nombre_doctor"
              render={({ field }) => (
                <FormItem className="inline-block">
                  <FormControl>
                    <Input
                      {...field}
                      inputType="text"
                      placeholder="Nombre del investigador"
                      className="inline text-sm px-1 py-[2px] h-6 border rounded-md"
                      onBlur={async (e) => {
                        const texto = (e.target as HTMLInputElement).value;
                        const matches: LTMatch[] = await checkSpellingWithLT(texto);
                        handleSpellCheck("nombre_doctor", matches);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />
            , celular{" "}
            <ShadcnFormField
              name="cel_doctor"
              render={({ field }) => (<FormItem className="inline-block">
                <FormControl>
                  <Input
                    {...field}
                    inputType="number"
                    placeholder="Celular del investigador"
                    className="inline text-sm px-1 py-[2px] h-6 border rounded-md"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500 ml-1" />
              </FormItem>)}
            />
            . A fin de activar la póliza la investigadora contactará a la Directora de la Oficina de Investigaciones del Hospital Universitario San Ignacio,
            <ShadcnFormField
              name="nombre_dir_investigaciones"
              render={({ field }) => (<FormItem className="inline-block">
                <FormControl>
                  <Input
                    {...field}
                    inputType="text"
                    placeholder="Director/a Of. Investigaciones"
                    className="inline text-sm px-1 py-[2px] h-6 border rounded-md"
                    onBlur={async (e) => {
                      const texto = (e.target as HTMLInputElement).value;
                      const matches: LTMatch[] = await checkSpellingWithLT(texto);
                      handleSpellCheck("nombre_dir_investigaciones", matches);
                    }}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500 ml-1" />
              </FormItem>)}
            />{" "}
            <ShadcnFormField
              name="cel_correo_dir_investigaciones"
              render={({ field }) => (<FormItem className="inline-block">
                <FormControl>
                  <Input
                    {...field}
                    inputType="text"
                    placeholder="celular o correo email"
                    className="inline text-sm px-1 py-[2px] h-6 border rounded-md"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500 ml-1" />
              </FormItem>)}
            />.
          </div>

          <p>
            Al firmar este formulario usted no renuncia a ningún derecho legal, aceptar atención médica o aceptar el pago de lo el/la s gastos médicos.
          </p>
        </div>
      ),
    } as FormField);

    return fields;
  }, [mostrarAsentimiento, mostrarPoliza, genero]);

  const autorizacionFields: FormField[] = [
    { key: "nombre_estudio", type: "text", required: true, hidden: true },
    {
      key: "genero_inv_principal", type: "select", required: true, hidden: true,
      options: [{ value: "Masculino", label: "Masculino" },
      { value: "Femenino", label: "Femenino" }]
    },
    { key: "nombre_inv_principal", type: "text", required: true, hidden: true },
    { key: "cel_inv_principal", type: "number", required: true, hidden: true },
    { key: "ext_inv_principal", type: "number", required: true, hidden: true },
    { key: "tel_inv_principal", type: "number", required: true, hidden: true },
    { key: "nombre_presidente", type: "text", required: true, hidden: true },

    {
      key: "textoAutorizacion",
      type: "custom",
      component: (
        <div className="text-sm text-gray-700 dark:text-foreground leading-[2]">
          <p>
            He comprendido las explicaciones que en un lenguaje claro y sencillo se me han brindado. El investigador me ha permitido expresar todas mis observaciones y ha aclarado todas las dudas y preguntas que he planteado respecto a los fines, métodos, ventajas, inconvenientes y pronóstico de participar en el estudio. Se me ha proporcionado una copia de este documento.
          </p>
          <div>
            Al firmar este documento doy mi consentimiento voluntario para participar en el estudio{" "}
            <ShadcnFormField
              name="nombre_estudio"
              render={({ field }) => (
                <FormItem className="inline-block">
                  <FormControl>
                    <Input
                      {...field}
                      inputType="text"
                      placeholder="Nombre del estudio"
                      className="inline text-sm px-1 py-[2px] h-6 border rounded-md"
                      onBlur={async (e) => {
                        const texto = (e.target as HTMLInputElement).value;
                        const matches: LTMatch[] = await checkSpellingWithLT(texto);
                        handleSpellCheck("nombre_estudio", matches);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />.
          </div>
          <div className="pt-4">
            Si usted tiene dudas acerca de su participación en este estudio puede comunicarse con el investigador principal:
            <ShadcnFormField
              name="genero_inv_principal"
              render={({ field }) => (
                <FormItem className="inline-block">
                  <FormControl>
                    <select
                      {...field}
                      className="inline text-sm px-1 py-[2px] h-6 border rounded-md"
                    >
                      <option value=""></option>
                      <option value="Masculino">Dr.</option>
                      <option value="Femenino">Dra.</option>
                    </select>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />{" "}
            <ShadcnFormField
              name="nombre_inv_principal"
              render={({ field }) => (
                <FormItem className="inline-block">
                  <FormControl>
                    <Input
                      {...field}
                      inputType="text"
                      placeholder="Nombre"
                      className="inline text-sm px-1 py-[2px] h-6 border rounded-md"
                      onBlur={async (e) => {
                        const texto = (e.target as HTMLInputElement).value;
                        const matches: LTMatch[] = await checkSpellingWithLT(texto);
                        handleSpellCheck("nombre_inv_principal", matches);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />, celular{" "}
            <ShadcnFormField
              name="cel_inv_principal"
              render={({ field }) => (
                <FormItem className="inline-block">
                  <FormControl>
                    <Input
                      {...field}
                      inputType="number"
                      placeholder="Número de celular"
                      className="inline text-sm px-1 py-[2px] h-6 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />, telefono{" "}
            <ShadcnFormField
              name="tel_inv_principal"
              render={({ field }) => (
                <FormItem className="inline-block">
                  <FormControl>
                    <Input
                      {...field}
                      inputType="number"
                      placeholder="Télefono"
                      className="inline text-sm px-1 py-[2px] h-6 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />, ext.{" "}
            <ShadcnFormField
              name="ext_inv_principal"
              render={({ field }) => (
                <FormItem className="inline-block">
                  <FormControl>
                    <Input
                      {...field}
                      inputType="number"
                      placeholder="Ext. "
                      className="inline text-sm px-1 py-[2px] h-6 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />.
          </div>
          <div>
            Presidente del Comité de Ética Institucional:{" "}
            <ShadcnFormField
              name="nombre_presidente"
              render={({ field }) => (
                <FormItem className="inline-block">
                  <FormControl>
                    <Input
                      {...field}
                      inputType="text"
                      placeholder="Nombre presidente"
                      className="inline text-sm px-1 py-[2px] h-6 border rounded-md"
                      onBlur={async (e) => {
                        const texto = (e.target as HTMLInputElement).value;
                        const matches: LTMatch[] = await checkSpellingWithLT(texto);
                        handleSpellCheck("nombre_presidente", matches);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />, Calle 42 No. 4–49, oficina 507. Teléfono 5946161 ext. 2470.
          </div>
        </div>
      ),
    },
  ]

  /* -------- JSX pre-construido que se pasa al template -------- */
  const cabeceraInitial = useMemo(
    () => pick(methods.getValues(), cabeceraFields.map(f => f.key)),
    [watch("version"), watch("codigo"), watch("fecha")]  // keys de la cabecera
  );

  const introInitial = useMemo(
    () => pick(methods.getValues(), introduccionFields.map(f => f.key)),
    [watch("nombre_proyecto"), watch("instituciones")]
  );

  const infoInitial = useMemo(
    () => pick(methods.getValues(), informacionGeneralFields.map(f => f.key)),
    [methods, informacionGeneralFields.map(f => watch(f.key)).join("|")]
  );


  const authInitial = useMemo(
    () => pick(methods.getValues(), autorizacionFields.map(f => f.key)),
    [methods, autorizacionFields.map(f => watch(f.key)).join("|")]
  );


  const sections: SectionConfig[] = [
    {
      sectionKey: "head",
      title: "Cabecera",
      fields: cabeceraFields,
      initialData: cabeceraInitial,
      open: openSections.head,
      onToggle: () => toggle("head"),
      formRef: cabeceraRef,
      onChange: onSectionChange,
    },
    {
      sectionKey: "intro",
      title: "Introducción",
      fields: introduccionFields,
      initialData: introInitial,
      open: openSections.intro,
      onToggle: () => toggle("intro"),
      formRef: introRef,
      onChange: onSectionChange,
      onSpellCheck: (k, t) => doSpellCheck(k, t),
      spellingWarnings,
    },
    {
      sectionKey: "info",
      title: "Información general",
      fields: informacionGeneralFields,
      initialData: infoInitial,
      open: openSections.info,
      onToggle: () => toggle("info"),
      formRef: infoRef,
      onChange: onSectionChange,
      dynamicFormKey: informacionGeneralFields.map(f => f.key).join("|"),
      onSpellCheck: (k, t) => doSpellCheck(k, t),
      spellingWarnings,
    },
    {
      sectionKey: "auth",
      title: "Autorización",
      fields: autorizacionFields,
      initialData: authInitial,
      open: openSections.auth,
      onToggle: () => toggle("auth"),
      formRef: authRef,
      onChange: onSectionChange,
      onSpellCheck: (k, t) => doSpellCheck(k, t),
      spellingWarnings,
    },
  ];

  const modalForm = (
    <ModalForm
      open={pdfModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          clearPdf();
        }
        setPdfModalOpen(open);
      }}
      title={{ text: "Visualizador PDF consentimiento informado", align: "left" }}
      formDataConfig={[
        [{
          type: "custom",
          key: "pdfPreview",
          placeholder: "Vista previa",
          component: <PdfRenderer url={pdfUrl} externalLoading={loading} />,
          required: false
        }]
      ]}
      onSubmit={handleModalSubmit}
      submitButtonText="Guardar caso"
      width="70%" height="90%"
    />
  );


  const spellingWarningsEl = (
    <>
      {Object.entries(spellingWarnings).map(([k, m]) => m.length > 0 && (
        <div key={k} className="text-xs text-red-600 mb-2">
          <strong>{k}:</strong>
          <ul>{m.map((mm, i) => <li key={i}>{mm.message} → <em>{mm.replacements.map(r => r.value).join(", ")}</em></li>)}</ul>
        </div>
      ))}
    </>
  );

  /* -------- Render -------- */
  return (
    <FormProvider {...methods}>
      <CreateCaseTemplate
        headerTitle="Crear nuevo caso"
        description="Llena cada uno de los campos requeridos del consentimiento informado "
        sections={sections}
        onFormSubmit={handleSubmit}
        modalForm={modalForm}
        spellingWarnings={spellingWarningsEl}
      />
    </FormProvider>
  );
}

