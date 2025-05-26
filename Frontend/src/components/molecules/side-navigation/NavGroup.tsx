import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/atoms/ui/collapsible'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/atoms/ui/sidebar'
import { Badge } from '@/components/atoms/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/atoms/ui/dropdown-menu'
import type { NavGroup as NavGroupType, NavItem, NavCollapsible, NavLink } from '@/types/sideBar'

export function NavGroup({ title, items }: NavGroupType) {
    const { state } = useSidebar()
    const location = useLocation()
    const href = location.pathname
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const key = `${item.title}-${'url' in item ? item.url : ''}`
                    if (!('items' in item))
                        return <SidebarMenuLink key={key} item={item as NavLink} href={href} />
                    if (state === 'collapsed')
                        return <SidebarMenuCollapsedDropdown key={key} item={item as NavCollapsible} href={href} />
                    return <SidebarMenuCollapsible key={key} item={item as NavCollapsible} href={href} />
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}

const NavBadge = ({ children }: { children: ReactNode }) => (
    <Badge className='rounded-full px-1 py-0 text-xs'>{children}</Badge>
)

const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
    const { setOpenMobile } = useSidebar()
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={checkIsActive(href, item)}
                tooltip={item.title}
            >
                <Link to={item.url} onClick={() => setOpenMobile(false)}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.badge && <NavBadge>{item.badge}</NavBadge>}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

const SidebarMenuCollapsible = ({ item, href }: { item: NavCollapsible; href: string }) => {
    const { setOpenMobile } = useSidebar()
    return (
        <Collapsible
            asChild
            defaultOpen={checkIsActive(href, item, true)}
            className='group/collapsible'
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.badge && <NavBadge>{item.badge}</NavBadge>}
                        <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className='CollapsibleContent'>
                    <SidebarMenuSub>
                        {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={checkIsActive(href, subItem)}
                                >
                                    <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                                        {subItem.icon && <subItem.icon />}
                                        <span>{subItem.title}</span>
                                        {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}

const SidebarMenuCollapsedDropdown = ({ item, href }: { item: NavCollapsible; href: string }) => {
    return (
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} isActive={checkIsActive(href, item)}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.badge && <NavBadge>{item.badge}</NavBadge>}
                        <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='right' align='start' sideOffset={4}>
                    <DropdownMenuLabel>
                        {item.title} {item.badge ? `(${item.badge})` : ''}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {item.items.map((sub) => (
                        <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
                            <Link
                                to={sub.url}
                                className={`${checkIsActive(href, sub) ? 'bg-secondary' : ''}`}
                            >
                                {sub.icon && <sub.icon />}
                                <span className='max-w-52 text-wrap'>{sub.title}</span>
                                {sub.badge && <span className='ml-auto text-xs'>{sub.badge}</span>}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    )
}

function checkIsActive(href: string, item: NavItem, mainNav = false) {
    return (
        href === ('url' in item ? item.url : "") ||
        href.split('?')[0] === ('url' in item ? item.url : "") ||
        (!!('items' in item && item.items?.filter((i) => i.url === href).length)) ||
        (mainNav &&
            href.split('/')[1] !== '' &&
            ('url' in item ? href.split('/')[1] === item.url?.split('/')[1] : false))
    )
}
