import SettingsTemplate from "@/components/templates/settings/SettingsTemplate"
import { sidebarData } from "@/data/sidebar-data"
import type { NavItem } from "@/types/sideBar"
import { useAuthContext } from "@/context/AuthContext"

export default function SettingsScreen() {
    const { user } = useAuthContext()

    const otrosGroup = sidebarData.navGroups.find(g => g.title === "Otros")
    const ajustesItem = otrosGroup?.items.find(i => i.title === "Ajustes")

    const sidebarNavItems: NavItem[] =
        (ajustesItem?.items ?? []).filter(it =>
            !it.roles || it.roles.includes(user?.type ?? "")
        )

    return <SettingsTemplate sidebarNavItems={sidebarNavItems} />
}
