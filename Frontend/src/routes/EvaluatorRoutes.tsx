import { useAuthContext } from "@/context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"

export default function EvaluatorRoutes() {
    const { user } = useAuthContext()

    if (!user) {
        return <Navigate to="/auth" />;
    }

    if (user?.type === "EVALUADOR") {
        return <Outlet />
    }

    return <Navigate to="/no-autorizado" />
}
