import * as React from "react"
import { format, subMonths } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange, SelectRangeEventHandler } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "../../atoms/ui/button"
import { Calendar } from "../../atoms/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../atoms/ui/popover"

export interface DatePickerWithRangeProps {
  from: Date
  to: Date
  onChange: (range: { from: Date; to: Date }) => void
  className?: string
}

export function DatePickerWithRange({
  from,
  to,
  onChange,
  className,
}: DatePickerWithRangeProps) {
  const [range, setRange] = React.useState<DateRange>({ from, to })
  const same = (a?: Date, b?: Date) =>
    !!a && !!b && a.getTime() === b.getTime()

  React.useEffect(() => {
    setRange({ from, to })
  }, [from, to])

  const handleSelect: SelectRangeEventHandler = (r) => {
    if (!r) return

    // rango completo → shift o clear
    if (range.from && range.to) {
      if (r.from && !r.to && same(r.from, range.from)) {
        setRange({ from: range.to, to: undefined })
        return
      }
      if (r.from && !r.to && same(r.from, range.to)) {
        setRange({ from: range.from, to: undefined })
        return
      }
      if (
        r.from &&
        r.to &&
        same(r.from, range.from) &&
        same(r.to, range.to)
      ) {
        setRange({ from: undefined, to: undefined })
        return
      }
    }

    // un solo día → clear
    if (range.from && !range.to && r.from && !r.to && same(r.from, range.from)) {
      setRange({ from: undefined, to: undefined })
      return
    }

    // selección normal
    setRange(r)
    if (r.from && r.to) onChange({ from: r.from, to: r.to })
  }

  const handleDayClick = (day: Date) => {
    // rango completo → shift endpoints
    if (range.from && range.to) {
      if (same(day, range.from)) {
        setRange({ from: range.to, to: undefined })
        return
      }
      if (same(day, range.to)) {
        setRange({ from: range.from, to: undefined })
        return
      }
    }
    // un solo día → clear
    if (range.from && !range.to && same(day, range.from)) {
      setRange({ from: undefined, to: undefined })
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !range.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2" />
            {range.from ? (
              range.to ? (
                `${format(range.from, "LLL dd, y")} – ${format(
                  range.to,
                  "LLL dd, y"
                )}`
              ) : (
                format(range.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleSelect}
            onDayClick={handleDayClick}
            numberOfMonths={2}
            defaultMonth={subMonths(new Date(), 1)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
