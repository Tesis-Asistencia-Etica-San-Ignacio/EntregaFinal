import React, { forwardRef } from "react"
import { File as FileIcon, FileText, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/atoms/ui/progress"
import { Button } from "@/components/atoms/ui/button"

export interface FileRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    fileUrl: string
    name: string
    size: number
    error?: boolean
    progress?: number
    onRemove?: () => void
    showProgress?: boolean
}

const FileRow = forwardRef<HTMLTableRowElement, FileRowProps>(
    ({ fileUrl, name, size, error, progress, onRemove, showProgress = false, className, ...props }, ref) => {
        // Determina si es imagen o PDF
        const isImage = /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(name)
        const isPdf = /\.pdf$/i.test(name)

        return (
            <tr ref={ref} className={cn("", className)} {...props}>
                {/* Previsualización */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="relative flex h-12 w-20 items-center justify-center">
                        {error ? (
                            <span className="text-red-500">Error</span>
                        ) : isImage ? (
                            <img src={fileUrl} alt={name} className="object-contain h-full w-full" />
                        ) : isPdf ? (
                            <FileText className="h-6 w-6 text-red-500" />
                        ) : (
                            <FileIcon className="h-6 w-6 text-gray-500" />
                        )}
                    </div>
                </td>
                {/* Nombre */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className="block truncate max-w-[150px] sm:max-w-full">{name}</span>
                </td>
                {/* Tamaño (KB) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm hidden sm:table-cell">
                    {(size / 1024).toFixed(1)} KB
                </td>
                {/* Progreso: sólo si showProgress es true */}
                {showProgress && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm hidden lg:table-cell">
                        <Progress value={progress ?? 0} isError={error} />
                    </td>
                )}
                {/* Acciones */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {onRemove && (
                        <Button variant="destructive" size="sm" onClick={onRemove}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                </td>
            </tr>
        )
    }
)

FileRow.displayName = "FileRow"
export default FileRow
