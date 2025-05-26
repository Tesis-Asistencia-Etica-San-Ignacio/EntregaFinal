import { GenericErrorMolecule } from '@/components/molecules/errors/GenericErrorMolecule'

export default function NotFoundErrorScreen() {
    return (
        <GenericErrorMolecule
            code={404}
            title="Página no encontrada"
            message="Lo sentimos, la página que buscas no existe."
            buttonText="Ir al inicio"
            buttonRoute="/"
        />
    )
}
