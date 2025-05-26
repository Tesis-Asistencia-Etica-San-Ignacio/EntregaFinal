/* import EvaluationHistoryTemplate from "../../templates/HistoryTemplate"
 */import { ArrowDown, ArrowRight, ArrowUp, CheckCircle, Circle, HelpCircle } from "lucide-react"
import { ColumnConfig } from "@/types/table"



const columnsConfig: ColumnConfig[] = [
    {
        id: "select",
        type: "selection",
    },
    {
        id: "id",
        accessorKey: "id",
        headerLabel: "Task ID",
        searchable: true,
    },
    {
        id: "title",
        accessorKey: "title",
        headerLabel: "Title",
        renderType: "badgeWithText",
        badgeKey: "label",
        textKey: "text",
        searchable: true,
    },
    {
        id: "status",
        accessorKey: "status",
        headerLabel: "status",
        // Definicion un array de items con value, label e icon (opcional).
        items: [
            {
                value: "backlog",
                label: "Backlog",
                // Importar el ícono
                icon: HelpCircle,
            },
            {
                value: "todo",
                label: "Todo",
                icon: Circle,
            },
            {
                value: "done",
                label: "Done",
                icon: CheckCircle,
            },
        ],
    },
    {
        id: "priority",
        accessorKey: "priority",
        headerLabel: "Priority",
        // Definicion un array de items con value, label e icon (opcional).
        items: [
            {
                value: "low",
                label: "Low",
                icon: ArrowDown,
            },
            {
                value: "medium",
                label: "Medium",
                icon: ArrowRight,
            },
            {
                value: "high",
                label: "High",
                icon: ArrowUp,
            },
        ],
    },
    // Columna de acciones con menú (3 puntos)
    {
        id: "actions",
        type: "actions",
        // Aquí definimos las opciones que aparecerán en el menú
        actionItems: [
            { label: "Edit" },
            { label: "Make a copy" },
            { label: "Favorite" },
            {
                label: "Labels",
                // Submenú con un radio group de ejemplo:
                subMenu: [
                    {
                        radioGroup: {
                            name: "labels",
                            valueKey: "label", // En tu data, p.e. row.original.label
                            options: [
                                { value: "bug", label: "Bug" },
                                { value: "feature", label: "Feature" },
                                { value: "documentation", label: "Documentation" },

                            ],
                        },
                    },
                ],
            },
            { label: "Delete", shortcut: "⌘⌫" },
        ],
    },
]
console.log(columnsConfig)

// Datos de ejemplo
/* const tableData = [
    {
        "id": "TASK-8782",
        "title": [
            {
                "text": "You can't compress the program without quantifying the open-source SSD pixel!",
                "label": "documentation"
            }
        ],
        "status": "todo",
        "priority": "medium", "hola": "hola"
    },
    {
        "id": "TASK-7878",
        "title": [
            {
                "text": "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!",
                "label": "documentation"
            }
        ],
        "status": "done",
        "priority": "medium", "hola": "hola"
    },
    {
        "id": "TASK-7839",
        "title": [
            {
                "text": "We need to bypass the neural TCP card!",
                "label": "bug"
            }
        ],
        "status": "backlog",
        "priority": "high", "hola": "hola"
    },
    {
        "id": "TASK-7839",
        "title": [
            {
                "text": "We need to bypass the neural TCP card!",
                "label": "bug"
            }
        ],
        "status": "backlog",
        "priority": "high", "hola": "hola"
    },
] */
/* 
export default function Ejemplo() {

    return (
        <div>
            <EvaluationHistoryTemplate data={tableData} columnsConfig={columnsConfig} />
        </div>
    )
}
 */

//Ejemplo de uso
/* const registryFields: FormField[][] = [
  [
    {
      type: "email",
      key: "email",
      placeholder: "Tu correo institucional",
      required: true,
    },
    {
      type: "select",
      key: "country",
      placeholder: "País",
      required: true,
      options: [
        { value: "mx", label: "México" },
        { value: "us", label: "Estados Unidos" },
      ],
      selectPlaceholder: "Selecciona un país",
    },
  ],
  [
    {
      type: "custom",
      key: "customField",
      placeholder: "Campo personalizado",
      component: (
        <Button variant="outline" className="w-full">
          Campo personalizado
        </Button>
      ),
    },
  ],
  [
    {
      type: "password",
      key: "password",
      placeholder: "Contraseña",
      required: true,
      minLength: 6,
      maxLength: 50,
    },
    {
      type: "extension-phone",
      key: "extension",
      placeholder: "Extensión",
      required: false,
      width: 50,
    },
  ],
  [
    {
      type: "phone",
      key: "phone",
      placeholder: "Teléfono",
      required: true,
      minLength: 7,
      maxLength: 10,
    },
    {
      type: "document",
      key: "document",
      placeholder: "Documento",
      required: true,
      minLength: 8,
    },
    {
      type: "address",
      key: "address",
      placeholder: "Dirección",
      required: true,
    },
  ],
  [
    {
      type: "user",
      key: "username",
      placeholder: "Usuario",
      required: true,
    },
    {
      type: "textarea",
      key: "bio",
      placeholder: "Biografía (auto ajustable)",
      required: false,
      autoAdjust: false, 
      width: 50,
    },
  ],
] */
