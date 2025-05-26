import { useAuthContext } from "@/context/AuthContext"
import LayoutTemplate from "@/components/templates/LayoutTemplate"
import { sidebarData } from "@/data/sidebar-data"
import type { NavItem, SidebarData } from "@/types/sideBar"

export default function LayoutScreen() {
    const { user, logout } = useAuthContext()

    function filterSidebarDataByRole(data: SidebarData, userRole: string): SidebarData {
        return {
            navGroups: data.navGroups.map(group => ({
                ...group,
                items: group.items
                    .map(item => {
                        if ("items" in item) {
                            const filteredSubItems = item.items?.filter(sub => {
                                if (!sub.roles) return true
                                return sub.roles.includes(userRole)
                            }) ?? []

                            return {
                                title: item.title,
                                badge: item.badge,
                                icon: item.icon,
                                roles: item.roles,
                                items: filteredSubItems
                            }
                        } else {
                            if (item.roles && !item.roles.includes(userRole)) {
                                return null
                            }
                            return {
                                title: item.title,
                                badge: item.badge,
                                icon: item.icon,
                                roles: item.roles,
                                url: item.url
                            }
                        }
                    })
                    .filter(Boolean) as NavItem[] // Forzamos a NavItem tras filtrar nulos
            }))
        }
    }


    const filteredData =
        user && user.type
            ? filterSidebarDataByRole(sidebarData, user.type)
            : sidebarData

    // Lógica de logout
    async function handleLogout() {
        try {
            await logout()
        } catch (error) {
            console.error("Error cerrando sesión:", error)
        }
    }

    // Lógica de iniciales
    function getInitials() {
        if (!user) return ""
        const firstInitial = user.name?.charAt(0)?.toUpperCase() || ""
        const lastInitial = user.last_name?.charAt(0)?.toUpperCase() || ""
        return `${firstInitial}${lastInitial}`
    }
    return (
        <LayoutTemplate
            user={user}
            sidebarData={filteredData}
            onLogout={handleLogout}
            getInitials={getInitials}
        />
    )
}