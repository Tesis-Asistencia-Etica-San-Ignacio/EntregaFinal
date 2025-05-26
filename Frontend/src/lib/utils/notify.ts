import { toast } from "sonner";
import { ReactNode } from "react";

export interface NotifyOptions {
    title: string;
    description?: string;
    icon?: ReactNode;
    closeButton?: boolean;
}

export function notifySuccess({ title, description, icon, closeButton }: NotifyOptions) {
    toast.success(title, { description, icon, closeButton });
}

export function notifyError({ title, description, icon, closeButton }: NotifyOptions) {
    toast.error(title, { description, icon, closeButton });
}

export function notifyInfo({ title, description, icon, closeButton }: NotifyOptions) {
    toast.info(title, { description, icon, closeButton });
}
