import React, { useState } from "react";
import ContentSection from "@/components/molecules/ContentSection";
import { DynamicForm, DynamicFormHandles } from "@/components/molecules/Dynamic-form";
import { FormField } from "@/types/formTypes";
import { Button } from "@/components/atoms/ui/button";
import ConfirmDialog from "@/components/organisms/dialogs/ConfirmDialog";
import { TriangleAlert } from "lucide-react";
import { Label } from "@/components/atoms/ui/label";
import { Input } from "@/components/atoms/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/atoms/ui/alert";

interface AccountTemplateProps {
    title: string;
    desc: string;
    accountFields: FormField[];
    passwordFields: FormField[];
    accountFormRef: React.RefObject<DynamicFormHandles | null>;
    passwordFormRef: React.RefObject<DynamicFormHandles | null>;
    onConfirmAccount: () => Promise<void> | void;
    onConfirmPassword: () => Promise<void> | void;
    accountInitialData?: { [key: string]: any };
    passwordInitialData?: { [key: string]: any };
}

export default function AccountTemplate({
    title,
    desc,
    accountFields,
    passwordFields,
    accountFormRef,
    passwordFormRef,
    onConfirmAccount,
    onConfirmPassword,
    accountInitialData = {},
    passwordInitialData = {},
}: AccountTemplateProps) {
    const [openAccount, setOpenAccount] = useState(false);
    const [openPassword, setOpenPassword] = useState(false);
    const [confirmValue, setConfirmValue] = useState("");

    return (
        <div className="flex flex-col w-full space-y-8">
            {/* ——— Bloque de actualización de cuenta ——— */}
            <ContentSection title={title} desc={desc}>
                <div className="lg:max-w-xl">
                    <form
                        id="account-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setOpenAccount(true);
                        }}

                        className="flex flex-col gap-4"
                    >
                        <DynamicForm
                            ref={accountFormRef}
                            formDataConfig={accountFields}
                            initialData={accountInitialData}
                            containerClassName="flex flex-col gap-4"
                        />
                        <Button type="submit">Actualizar Cuenta</Button>
                    </form>
                </div>
            </ContentSection>

            {/* ——— Bloque de actualización de contraseña ——— */}
            <ContentSection title="Contraseña" desc="Actualiza tu contraseña.">
                <div className="lg:max-w-xl">
                    <form
                        id="password-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setOpenPassword(true);
                        }}
                        autoComplete="off"
                        className="flex flex-col gap-4"
                    >
                        <DynamicForm
                            ref={passwordFormRef}
                            formDataConfig={passwordFields}
                            initialData={passwordInitialData}
                            containerClassName="flex flex-col gap-4"
                        />
                        <Button type="submit">Actualizar Contraseña</Button>
                    </form>
                </div>
            </ContentSection>

            {/* ——— Confirmación para datos de cuenta ——— */}
            <ConfirmDialog
                open={openAccount}
                onOpenChange={setOpenAccount}
                handleConfirm={onConfirmAccount}
                title="¿Actualizar datos de la cuenta?"
                description="Se guardarán los cambios realizados."
                confirmText="Sí, actualizar"
            />

            {/* ——— Confirmación para cambio de contraseña ——— */}
            <ConfirmDialog
                open={openPassword}
                onOpenChange={setOpenPassword}
                handleConfirm={onConfirmPassword}
                disabled={confirmValue.trim() !== "ACTUALIZAR"}
                destructive
                title={
                    <span className="text-destructive inline-flex items-center">
                        <TriangleAlert size={18} className="mr-1" />
                        Actualizar contraseña
                    </span>
                }
                description={
                    <div className="space-y-4">
                        <p>
                            Esta acción <strong>reemplazará tu contraseña</strong>. Para confirmar, escribe{" "}
                            <code>ACTUALIZAR</code>:
                        </p>
                        <Label>
                            <Input
                                value={confirmValue}
                                onChange={(e) => setConfirmValue(e.target.value)}
                                placeholder="ACTUALIZAR"
                            />
                        </Label>
                        <Alert variant="destructive">
                            <AlertTitle>¡Atención!</AlertTitle>
                            <AlertDescription>
                                Después de actualizar, tendrás que volver a iniciar sesión.
                            </AlertDescription>
                        </Alert>
                    </div>
                }
                confirmText="Actualizar"
            />
        </div>
    );
}
