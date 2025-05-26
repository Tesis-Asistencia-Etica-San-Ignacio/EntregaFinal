import React, { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle as ShadcnDialogTitle,
} from "@/components/atoms/ui/dialog";
import { Button } from "@/components/atoms/ui/button";
import { DynamicForm, DynamicFormHandles } from "@/components/molecules/Dynamic-form";
import type { FormField } from "@/types/formTypes";
import { useNotify } from "@/hooks/useNotify";

export interface TitleConfig {
    text: string;
    align?: "left" | "center";
}

export interface ModalFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: TitleConfig;
    formDataConfig: FormField[] | FormField[][];
    initialData?: { [key: string]: any };
    onSubmit: (data: { [key: string]: any }) => Promise<void> | void;
    submitButtonText?: string;
    width?: string;
    height?: string;
    successToast?: {
        title: string;
        description: string;
        icon: React.ReactNode;
        closeButton?: boolean;
    };
    errorToast?: {
        title: string;
        description: string;
        icon: React.ReactNode;
        closeButton?: boolean;
    };
}

const ModalForm: React.FC<ModalFormProps> = ({
    open,
    onOpenChange,
    title,
    formDataConfig,
    onSubmit,
    submitButtonText = "Enviar",
    width = "50%",
    height = "50%",
    successToast,
    errorToast,
    initialData
}) => {
    const [loading, setLoading] = useState(false);
    const formRef = useRef<DynamicFormHandles>(null);
    const { notifySuccess, notifyError } = useNotify();

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation(); 
        if (!formRef.current) return;

        formRef.current.handleSubmit(async (data: any) => {
            setLoading(true);
            try {
                await onSubmit(data);
                if (successToast) notifySuccess(successToast);
                setTimeout(() => onOpenChange(false), 500);
            } catch {
                if (errorToast) notifyError(errorToast);
            } finally {
                setLoading(false);
            }
        })();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="p-6"
                style={{ width, maxWidth: "90vw", height, maxHeight: "90vh", overflow: "auto" }}
            >
                <div className="flex flex-col h-full">
                    <div className={`mb-4 ${title.align === "center" ? "text-center" : "text-left"}`}>
                        <ShadcnDialogTitle>{title.text}</ShadcnDialogTitle>
                    </div>
                    <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 min-h-0">
                        <DynamicForm ref={formRef}
                            formDataConfig={formDataConfig}
                            initialData={initialData}
                        />
                        <div className="mt-4 flex">
                            <Button type="submit" disabled={loading} className="ml-auto">
                                {loading ? "Enviando..." : submitButtonText}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ModalForm;
