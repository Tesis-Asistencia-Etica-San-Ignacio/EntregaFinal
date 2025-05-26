import { useForm, FormProvider } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import {
    FormControl,
    FormField as ShadcnFormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/atoms/ui/form"
import { Input } from "@/components/atoms/ui/input-form"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/atoms/ui/select"
import { Textarea } from "@/components/atoms/ui/textarea"
import type {
    FormField,
    SelectFormField,
    CustomFormField,
    TextAreaFormField,
    DateFormField,
    FieldType,
} from "@/types/formTypes"
import { LTMatch } from "@/lib/api/languageApi"


import CalendarPicker from "./calendars/DatePicker"
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import isEqual from "lodash.isequal"
function baseValidationForType(type: FieldType): z.ZodTypeAny {
    // declara schema como “cualquier Zod” (no sólo string)
    let schema: z.ZodTypeAny

    switch (type) {
        /* ──────── casillas tipo string ─────────── */
        case "email":
            schema = z.string().trim()
                .email("El email no es válido")
                .max(50, "Máximo 50 caracteres")
            break
        case "password":
            schema = z.string().trim()
                .max(200, "Máximo 200 caracteres")
            break
        case "phone":
            schema = z.string().trim()
                .regex(/^\d+$/, "Solo dígitos")
                .max(10, "Máximo 10 dígitos")
            break
        case "extension-phone":
            schema = z.string().trim()
                .regex(/^\d+$/, "Solo dígitos")
                .max(2, "Máximo 2 dígitos")
            break
        case "document":
            schema = z.string().trim().max(50, "Máximo 50 caracteres")
            break
        case "user":
            schema = z.string().trim().max(40, "Máximo 40 caracteres")
            break
        case "address":
            schema = z.string().trim().max(100, "Máximo 100 caracteres")
            break

        case "datePicker": {
            schema = z.preprocess(
                (v) => {
                    if (v instanceof Date) return v
                    const d = new Date(v as any)
                    return isNaN(d.getTime()) ? undefined : d
                },
                z.date()
            )
            break
        }


        /* ──────── numérico ─────────────────────── */
        case "number": {
            const preprocessNumber = z.preprocess(
                (v) => {
                    if (v === "" || v === null || v === undefined) return undefined
                    const n = Number(v)
                    return Number.isNaN(n) ? NaN : n
                },
                z.number().min(1, "El número debe ser mayor a 0")
                    .optional()       // permite undefined
            )

            schema = preprocessNumber.refine(
                (v) => v === undefined || !Number.isNaN(v),
                { message: "Debe ser un número" }
            )
            break
        }

        /* ─────── por defecto: string simple ─────── */
        default:
            schema = z.string().trim()
            break
    }

    return schema
}

export function buildZodSchemaForField(field: FormField): z.ZodTypeAny {
    let schema = baseValidationForType(field.type)

    /* ───── Campo requerido ───────────────────── */
    if (field.required) {
        if (schema instanceof z.ZodString) {
            schema = schema.nonempty("Este campo es requerido")
        } else {
            // para números u otros tipos
            schema = schema.refine(
                (v) => v !== undefined && v !== null && v !== "",
                { message: "Este campo es requerido" }
            )
        }
    }

    /* ───── min / max sólo en strings ─────────── */
    if (schema instanceof z.ZodString) {
        if (typeof field.minLength !== "undefined") {
            schema = schema.min(field.minLength, `Mínimo ${field.minLength} caracteres`)
        }
    }
    if (typeof field.maxLength !== "undefined") {
        schema = (schema as z.ZodString).max(field.maxLength, `Máximo ${field.maxLength} caracteres`
        )
    }

    if (field.customValidation) {
        schema = schema.superRefine((val, ctx) => {
            const error = field.customValidation!(val);
            if (error) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: error,
                });
            }
        });
    }

    return schema.default(field.type === "datePicker" ? new Date() : "")
}


function flattenFields(data: FormField[] | FormField[][]): FormField[] {
    if (!Array.isArray(data) || data.length === 0) return []
    if (Array.isArray(data[0])) return (data as FormField[][]).flat()
    return data as FormField[]
}


export interface DynamicFormHandles {
    handleSubmit: <T>(onValid: (data: any) => T) => (e?: React.BaseSyntheticEvent) => Promise<void>
    trigger: (name?: string | string[]) => Promise<boolean>
    reset: (values?: Record<string, any>) => void

}


export interface DynamicFormProps {
    formDataConfig: FormField[] | FormField[][]
    onSubmit?: (data: { [key: string]: any }) => void
    onChange?: (data: { [key: string]: any }) => void

    onSpellCheck?: (key: string, text: string) => void
    spellWarnings?: Record<string, LTMatch[]>
    containerClassName?: string
    initialData?: { [key: string]: any }
}

export const DynamicForm = forwardRef<DynamicFormHandles, DynamicFormProps>(({
    formDataConfig,
    onChange,
    onSpellCheck,
    containerClassName,
    spellWarnings = {},
    initialData = {},
}, ref) => {
    const flatFields = flattenFields(formDataConfig)

    const shape: Record<string, z.ZodTypeAny> = {}
    flatFields.forEach((field) => {
        shape[field.key] = buildZodSchemaForField(field).default("")
    })

    const finalSchema = z.object(shape)

    const form = useForm({
        resolver: zodResolver(finalSchema),
        defaultValues: initialData,
        mode: "onChange",
    })

    const {
        control,
        watch,
        formState: { errors },
        handleSubmit,
    } = form

    useImperativeHandle(ref, () => ({
        handleSubmit,
        trigger: form.trigger,
        __formInstance: form,
        reset: form.reset,
    }))


    useEffect(() => {
        const subscription = watch((values) => {
            onChange?.(values)
        })
        return () => subscription.unsubscribe()
    }, [watch, onChange])

    const prevInit = useRef(initialData);

    useEffect(() => {
        if (!isEqual(prevInit.current, initialData)) {
            form.reset(initialData);          // sólo si de verdad cambió
            prevInit.current = initialData;
        }
    }, [initialData, form]);


    const renderField = (field: FormField) => {
        if (field.hidden === true) return null    // se pinta salvo que sea true


        return (
            <ShadcnFormField
                key={field.key}
                control={control}
                name={field.key}
                render={({ field: controllerField }) => (
                    <FormItem
                        className={cn(
                            field.width ? "max-w-full" : "flex-1",
                            "flex flex-col p-0.5"
                        )}
                        style={field.width ? { width: `${field.width}%` } : {}}
                    >
                        <FormLabel>{field.label ?? field.placeholder}</FormLabel>

                        <FormControl>
                            {(() => {
                                if (field.type === "custom") {
                                    return (field as CustomFormField).component
                                }
                                if (field.type === "select") {
                                    const f = field as SelectFormField
                                    return (
                                        <Select
                                            value={controllerField.value || ""}
                                            onValueChange={controllerField.onChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder={f.selectPlaceholder || f.placeholder}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {f.options.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )
                                }
                                if (field.type === "textarea") {
                                    const f = field as TextAreaFormField
                                    return (
                                        <Textarea
                                            autoAdjust={f.autoAdjust}
                                            placeholder={f.placeholder}
                                            value={controllerField.value || ""}
                                            onChange={controllerField.onChange}
                                            onBlur={e => onSpellCheck?.(field.key, e.target.value)}
                                        />
                                    )
                                }
                                if (field.type === "datePicker") {
                                    const f = field as DateFormField & { minDate?: Date; maxDate?: Date };
                                    return (
                                        <CalendarPicker
                                            value={controllerField.value as Date | undefined}
                                            onChange={controllerField.onChange}
                                            minDate={f.minDate}
                                            maxDate={f.maxDate}
                                            placeholder={f.placeholder}
                                            className="w-full"
                                        />
                                    );
                                }

                                // Si es un password, elegimos current- vs new-password según la key
                                const autoComplete =
                                    field.type === "password"
                                        ? field.key === "newPassword"
                                            ? "new-password"
                                            : "current-password"
                                        : field.type === "email"
                                            ? "email"
                                            : undefined;

                                return (
                                    <Input
                                        inputType={field.type}
                                        placeholder={field.placeholder}
                                        autoComplete={autoComplete}
                                        value={controllerField.value || ""}
                                        onChange={controllerField.onChange}
                                        onBlur={e => onSpellCheck?.(field.key, e.target.value)}
                                    />
                                )
                            })()}
                        </FormControl>

                        <FormMessage className="min-h-[1.25rem]">
                            {errors[field.key]?.message as string || spellWarnings[field.key]?.[0]?.message}
                        </FormMessage>
                    </FormItem>
                )}
            />
        )
    }

    const isMultipleRows =
        Array.isArray(formDataConfig) &&
        formDataConfig.length > 0 &&
        Array.isArray(formDataConfig[0])

    const renderRows = () => {
        const visibleRows = isMultipleRows
            ? (formDataConfig as FormField[][]).map((row) => row.filter((f) => !f.hidden))
            : (formDataConfig as FormField[]).filter((f) => !f.hidden)

        if (isMultipleRows) {
            return (visibleRows as FormField[][]).map((row, i) => (
                <div key={i} className="flex flex-wrap gap-4 mb-4">
                    {row.map((field) => renderField(field))}
                </div>
            ))
        }
        return (visibleRows as FormField[]).map((field) => (
            <div key={field.key} className="mb-4">
                {renderField(field)}
            </div>
        ))
    }

    return (
        <FormProvider {...form}>
            <div className={cn(containerClassName)}>
                {renderRows()}
            </div>
        </FormProvider>
    )
})
