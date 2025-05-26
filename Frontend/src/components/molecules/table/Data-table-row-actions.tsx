import React from "react"
import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/atoms/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/atoms/ui/dropdown-menu"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/atoms/ui/tooltip"

import { ActionItem } from "@/types/table"

interface DataTableRowActionsProps<TData> {
  readonly row: Row<TData>
  readonly actionItems?: ReadonlyArray<ActionItem>
}

export function DataTableRowActions<TData>({
  row,
  actionItems = [],
}: DataTableRowActionsProps<TData>) {
  // Si no hay items, no se muestra nada
  if (!actionItems.length) {
    return null
  }

  const rowData = row.original

  const visibleItems = actionItems.filter(action => {
    if (action.visible) {
      return action.visible(rowData)
    }
    return true
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">
        {visibleItems.map((action, idx) => {
          // Si tiene subMenu
          if (action.subMenu && action.subMenu.length > 0) {
            return (
              <React.Fragment key={idx}>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    {action.label}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {action.subMenu.map((sub, sIdx) => {
                      if (sub.radioGroup) {
                        // Ejemplo: sub.radioGroup => { name, valueKey, options[] }
                        const currentValue = (rowData as any)[sub.radioGroup.valueKey]
                        return (
                          <DropdownMenuRadioGroup key={sIdx} value={currentValue} >
                            {sub.radioGroup.options.map((opt) => (
                              <DropdownMenuRadioItem
                                key={opt.value}
                                value={opt.value}
                                onSelect={() => {
                                  // Lógica de click en cada radio
                                  console.log(`Selected ${opt.value} for ${sub.radioGroup?.name}`)
                                }}
                              >
                                {opt.label}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        )
                      }
                      // Caso sub-ítems “normales”, si quisieras
                      return (
                        <DropdownMenuItem key={sIdx}>
                          {action.label} sub item
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
              </React.Fragment>
            )
          }
          // Item normal (sin subMenu)
          const isDisabled =
            typeof action.disabled === "function"
              ? action.disabled(rowData)
              : !!action.disabled

          const item = (
            <DropdownMenuItem
              key={idx}
              onClick={e => {
                if (isDisabled) {
                  e.preventDefault()
                  e.stopPropagation()
                  return
                }
                action.onClick?.(rowData)
              }}
              className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
            >
              {action.label}
              {action.shortcut && (
                <DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          )

          if (!isDisabled || !action.tooltip) return item

          return (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>{item}</TooltipTrigger>
              <TooltipContent>{action.tooltip}</TooltipContent>
            </Tooltip>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
