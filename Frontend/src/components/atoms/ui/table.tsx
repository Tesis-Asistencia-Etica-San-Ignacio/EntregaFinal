import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/atoms/ui/tooltip"

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >

      <TooltipProvider>
        <table
          data-slot="table"
          className={cn("w-full caption-bottom text-sm ", className)}
          {...props}
        />
      </TooltipProvider>
    </div>
  )
}

export function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

export function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

export function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-selected-item-table border-b transition-colors ",
        className
      )}
      {...props}
    />
  )
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-muted-foreground h-10 px-2 font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] ",
        className
      )}
      {...props}
    />
  )
}


export function TableCell({
  className,
  children,
  colSpan,
  ...props
}: React.ComponentProps<"td"> & { colSpan?: number }) {

  if (colSpan) {
    return (
      <td
        colSpan={colSpan}
        className={cn("p-2 align-middle text-center ", className)}
        {...props}
      >
        {children}
      </td>
    )
  }

  // 2) Caso normal: medimos overflow en el <span> y aplicamos tooltip:
  const spanRef = React.useRef<HTMLSpanElement>(null)
  const [isOverflow, setIsOverflow] = React.useState(false)

  const checkOverflow = React.useCallback(() => {
    const el = spanRef.current
    if (el) setIsOverflow(el.scrollWidth > el.clientWidth)
  }, [])

  React.useLayoutEffect(checkOverflow, [children, checkOverflow])
  React.useEffect(() => {
    const el = spanRef.current
    if (!el || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(checkOverflow)
    ro.observe(el)
    return () => ro.disconnect()
  }, [checkOverflow])

  const innerSpan = (
    <span
      ref={spanRef}
      className="block truncate align-middle max-w-[450px]"
    >
      {children}
    </span>
  )

  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap max-w-[250px] [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        isOverflow && "cursor-pointer",
        className
      )}
      {...props}
    >
      {isOverflow ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{innerSpan}</TooltipTrigger>
            <TooltipContent
              side="top"
              align="center"
              className={
                "whitespace-normal break-words min-w-[200px] max-w-[20rem] leading-snug px-2 py-2"
              }
            >
              {children}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        innerSpan
      )}
    </td>
  )
}



export function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}
