import React from "react"
import { Spinner } from "../atoms/spinner"

export const LoadingFallback: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Spinner size="lg" variant="primary" />
            <p className="mt-4 text-lg ">Cargando...</p>
        </div>
    )
}
