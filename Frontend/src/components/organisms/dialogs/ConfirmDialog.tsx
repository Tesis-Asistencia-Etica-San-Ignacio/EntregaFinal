import React from "react";
import { z, ZodSchema } from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/atoms/ui/dialog";
import { Button } from "@/components/atoms/ui/button";
import { Form } from "@/components/atoms/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotify } from "@/hooks/useNotify";

export interface ToastCfg {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    closeButton?: boolean;
}

export interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    handleConfirm: () => Promise<void> | void;
    disabled?: boolean;
    title: React.ReactNode;
    description: React.ReactNode;
    confirmText: string;
    destructive?: boolean;
    schema?: ZodSchema<any>;
    successToast?: ToastCfg;
    errorToast?: ToastCfg;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    handleConfirm,
    disabled = false,
    title,
    description,
    confirmText,
    destructive = false,
    schema = z.object({}),
    successToast,
    errorToast,
}: ConfirmDialogProps) {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {},
        mode: "onSubmit",
    });

    const { notifySuccess, notifyError } = useNotify();

    const onSubmit = async () => {
        try {
            await handleConfirm();
            if (successToast?.title) notifySuccess(successToast);
            onOpenChange(false);
        } catch {
            if (errorToast?.title) notifyError(errorToast);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent style={{ minWidth: "25vw", maxWidth: "35vw", overflow: "auto" }}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                        </DialogHeader>

                        {/* force the description into a <div> instead of Radix’s default <p> */}
                        <DialogDescription asChild>
                            <div className="text-muted-foreground text-sm">
                                {description}
                            </div>
                        </DialogDescription>

                        <DialogFooter>
                            <Button
                                type="submit"
                                variant={destructive ? "destructive" : "default"}
                                disabled={disabled || form.formState.isSubmitting}
                            >
                                {confirmText}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default ConfirmDialog;
