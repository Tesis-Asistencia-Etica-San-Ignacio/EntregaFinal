import React, {
    forwardRef,
    useReducer,
    useState,
    ChangeEvent,
    DragEvent,
    useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useCreateEvaluationHook from "@/hooks/evaluation/useCreateEvaluation";
import type { FileWithUrl } from "@/types/fileType";
import FileRow from "@/components/molecules/FileRowDropFile";
import { Button } from "@/components/atoms/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const MAX_FILES = 10;

type Action =
    | { type: "ADD_FILES"; payload: FileWithUrl[] }
    | { type: "REMOVE_FILE"; payload: number }
    | { type: "UPDATE_PROGRESS"; payload: { index: number; progress: number } }
    | { type: "CLEAR_FILES" };

type State = FileWithUrl[];

function fileReducer(state: State, action: Action): State {
    switch (action.type) {
        case "ADD_FILES":
            if (state.length + action.payload.length > MAX_FILES) {
                toast.error(`Máximo ${MAX_FILES} archivos PDF.`, { closeButton: true });
                return state;
            }
            return [...state, ...action.payload];

        case "REMOVE_FILE":
            return state.filter((_, i) => i !== action.payload);

        case "UPDATE_PROGRESS":
            return state.map((f, i) =>
                i === action.payload.index
                    ? { ...f, progress: action.payload.progress }
                    : f
            );

        case "CLEAR_FILES":
            return [];

        default:
            return state;
    }
}

const FileInput = forwardRef<
    HTMLInputElement,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">
>(({ className, ...props }, ref) => {
    const [files, dispatch] = useReducer(fileReducer, []);
    const [dragActive, setDragActive] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const { uploadFiles, loading } = useCreateEvaluationHook();
    const navigate = useNavigate();

    // Solo PDF
    const validateFileType = (file: File) => /\.pdf$/i.test(file.name);

    const handleFiles = (incoming: File[]) => {
        const newFiles = incoming.map(file => {
            const ok = validateFileType(file);
            if (!ok) {
                toast.error(`${file.name} no es PDF.`, { closeButton: true });
            }
            return {
                file,
                name: file.name,
                size: file.size,
                url: URL.createObjectURL(file),
                error: !ok,
                progress: 0,
            };
        }).filter(f => !f.error);
        dispatch({ type: "ADD_FILES", payload: newFiles });
    };

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation(); setDragActive(true);
    };
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation(); setDragActive(true);
    };
    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation(); setDragActive(false);
    };
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation(); setDragActive(false);
        handleFiles(Array.from(e.dataTransfer.files));
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFiles(Array.from(e.target.files || []));
    };

    const handleRemoveFile = (idx: number) =>
        dispatch({ type: "REMOVE_FILE", payload: idx });

    const handleClickContainer = () =>
        document.getElementById("dropzone-file")?.click();

    const handleUploadClick = useCallback(async () => {
        if (loading || files.length === 0) return;
        setShowProgress(true);
        await uploadFiles(files, (i, pct) =>
            dispatch({ type: "UPDATE_PROGRESS", payload: { index: i, progress: pct } })
        );
        dispatch({ type: "CLEAR_FILES" });
        setShowProgress(false);
        navigate("/historial-archivos-evaluados");
    }, [files, loading, uploadFiles, navigate]);

    const noFiles = files.length === 0;

    return (
        <div className="w-full h-full">
            <div
                className={cn(
                    "relative w-full border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition",
                    dragActive && "bg-gray-100",
                    noFiles ? "h-[95%]" : "h-fit",
                    className
                )}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClickContainer}
            >
                {noFiles ? (
                    <>
                        <svg
                            aria-hidden="true"
                            className="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click para subir archivos</span> o arrastra y suelta
                        </p>
                        <p className="text-xs text-gray-500">hasta {MAX_FILES} archivos PDF</p>
                        <input
                            {...props}
                            accept=".pdf"
                            ref={ref}
                            multiple
                            onChange={handleChange}
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col">
                        <div className="overflow-x-auto rounded-3xl">
                            <div className="min-w-full">
                                <div className="overflow-hidden border border-gray-300 rounded-3xl">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-muted">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                                    Previsualización
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                                    Nombre
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                                                    Tamaño
                                                </th>
                                                {showProgress && (
                                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">
                                                        Progreso
                                                    </th>
                                                )}
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {files.map((file, idx) => (
                                                <FileRow
                                                    key={idx}
                                                    fileUrl={file.url}
                                                    name={file.name}
                                                    size={file.size}
                                                    error={file.error}
                                                    progress={file.progress}
                                                    showProgress={showProgress}
                                                    onRemove={() => handleRemoveFile(idx)}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                    <label
                                        htmlFor="more-files"
                                        className="flex items-center justify-center py-2 border-t border-gray-300 bg-muted/80 cursor-pointer hover:bg-gray-100 transition"
                                    >
                                        <Plus className="w-6 h-6 text-gray-500" />
                                        <input
                                            {...props}
                                            accept=".pdf"
                                            ref={ref}
                                            multiple
                                            onChange={handleChange}
                                            type="file"
                                            id="more-files"
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {files.length > 0 && (
                <div className="mt-4 py-2 flex justify-end">
                    <Button
                        onClick={handleUploadClick}
                        disabled={loading}
                        className="cursor-pointer"
                    >
                        {loading ? "Subiendo..." : "Subir Archivos"}
                    </Button>
                </div>
            )}
        </div>
    );
});

FileInput.displayName = "FileInput";
export default FileInput;
