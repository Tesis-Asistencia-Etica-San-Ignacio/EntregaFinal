
interface BaseNavItem {
    title: string;
    badge?: string;
    icon?: React.ElementType;
    roles?: string[];
}

export type NavLink = BaseNavItem & {
    url: string;
    items?: never;
};

export type NavCollapsible = BaseNavItem & {
    items: (BaseNavItem & { url: string })[];
    url?: never;
};

export type NavItem = NavLink | NavCollapsible;

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface SidebarData {
    navGroups: NavGroup[];
}
