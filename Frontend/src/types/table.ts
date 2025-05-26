import React from "react"

/**
 * Representa un ítem para la columna (ej. un badge con icono).
 */
export interface ColumnItem {
    value: string
    label: string
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
    badgeVariant?: string
}

/**
 * Acciones que pueden aparecer en la columna "actions".
 */

type RadioGroupConfig = {
    name: string
    valueKey: string
    options: { value: string; label: string }[]
}

export interface ActionItem {
    label: string
    shortcut?: string
    visible?: (rowData: any) => boolean
    onClick?: (rowData: any) => void

    disabled?: boolean | ((rowData: any) => boolean)
    tooltip?: string
    subMenu?: {
        radioGroup?: RadioGroupConfig
    }[]
}

/**
 * Configuración para cada columna de la tabla.
 * id: identificador único de la columna
 * type: define comportamientos especiales (ej. "selection", "actions", etc.)
 * accessorKey: clave que se usará para acceder al valor en los datos
 * headerLabel: texto a mostrar en el encabezado
 * renderType: indica un tipo de renderizado (ej. "badgeWithText")
 * badgeKey: usado para el caso de "badgeWithText"
 * textKey: usado para el caso de "badgeWithText"
 * items: lista de ColumnItem si la columna maneja iconos/labels
 * actionItems: acciones disponibles si es columna de tipo "actions"
 * searchable: indica si la columna participa en el filtro global
 * badgeVariant: variante de badge por defecto
 */
export interface ColumnConfig {
    id: string
    type?: "selection" | "actions" | "badgeWithText" | string
    accessorKey?: string
    headerLabel?: string
    renderType?: string
    badgeKey?: string
    textKey?: string
    items?: ColumnItem[]
    actionItems?: ActionItem[]
    searchable?: boolean
    badgeVariant?: string
    hidden?: boolean
}
