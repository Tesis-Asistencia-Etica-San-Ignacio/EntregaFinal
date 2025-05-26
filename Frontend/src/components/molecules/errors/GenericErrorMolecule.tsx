import { useNavigate } from "react-router-dom"
import { Button } from "@/components/atoms/ui/button"

interface GenericErrorProps {
    code: number | string
    title: string
    message: string
    buttonText?: string
    buttonRoute?: string
}

export function GenericErrorMolecule({
    code,
    title,
    message,
    buttonText = "Back to Home",
    buttonRoute = "/auth",
}: GenericErrorProps) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(buttonRoute)
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center gap-2">
            <h1 className="text-[7rem] font-bold leading-tight">{code}</h1>
            <span className="font-medium">{title}</span>
            <p className="text-center text-muted-foreground">{message}</p>
            <div className="mt-6">
                <Button onClick={handleClick}>{buttonText}</Button>
            </div>
        </div>
    )
}
