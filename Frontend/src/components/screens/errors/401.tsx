import { GenericErrorMolecule } from "@/components/molecules/errors/GenericErrorMolecule"

export default function UnauthorizedErrorScreen() {
    return (
        <GenericErrorMolecule
            code={401}
            title="Acceso no autorizado"
            message="Inicie sesión con las credenciales adecuadas para acceder a este recurso."
            buttonText="Volver"
            buttonRoute="/auth"
        />
    )
}
