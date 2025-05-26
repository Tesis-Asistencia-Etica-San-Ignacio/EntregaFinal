import React, { useState, useEffect, useRef } from "react";
import { Popover, PopoverTrigger, PopoverContent, PopoverPortal } from "@radix-ui/react-popover";
import { Button } from "@/components/atoms/ui/button";
import { Calendar } from "@/components/atoms/ui/calendar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/atoms/ui/collapsible";
import { ScrollArea } from "@/components/atoms/ui/scroll-area";
import {
    eachYearOfInterval,
    eachMonthOfInterval,
    startOfYear,
    endOfYear,
    format,
    isBefore,
    isAfter,
} from "date-fns";
import { ChevronDown } from "lucide-react";
import type { CaptionLabelProps, MonthGridProps } from "react-day-picker";

export interface CalendarPickerProps {
    value?: Date;
    onChange: (date: Date) => void;
    minDate?: Date;
    maxDate?: Date;
    placeholder?: string;
    className?: string;
}

export default function CalendarPicker({
    value,
    onChange,
    minDate,
    maxDate,
    placeholder = "Selecciona fecha",
    className,
}: CalendarPickerProps) {
    const [open, setOpen] = useState(false);
    const [viewYear, setViewYear] = useState(false);

    // 1) Parsear value si viene como string
    const parsedValue: Date | undefined =
        value && !(value instanceof Date)
            ? new Date(value as any)
            : (value as Date | undefined);

    // 2) Inicializar el mes desde parsedValue
    const [month, setMonth] = useState<Date>(parsedValue ?? new Date());

    const start = minDate ?? new Date(1960, 0, 1);
    const end = maxDate ?? new Date();
    const years = eachYearOfInterval({
        start: startOfYear(start),
        end: endOfYear(end),
    });

    const currentYearRef = useRef<HTMLDivElement>(null);
    const currentMonthRef = useRef<HTMLButtonElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (viewYear && currentYearRef.current && scrollRef.current) {
            const viewport = scrollRef.current.querySelector(
                "[data-radix-scroll-area-viewport]"
            ) as HTMLElement;
            if (viewport) {
                viewport.scrollTop = currentYearRef.current.offsetTop;
                setTimeout(() => currentMonthRef.current?.focus(), 100);
            }
        }
    }, [viewYear]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className={className}>
                    {/* 3) Mostrar parsedValue en lugar de value */}
                    {parsedValue ? format(parsedValue, "PPP") : placeholder}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverPortal>
                <PopoverContent
                    align="start"
                    sideOffset={4}
                    className="z-50 w-auto p-0"
                >
                    <Calendar
                        mode="single"
                        /* ─── 4) Usar parsedValue para selected ─── */
                        selected={parsedValue}
                        onSelect={(d) => {
                            onChange(d!);
                            setOpen(false);
                            setViewYear(false);
                        }}
                        month={month}
                        onMonthChange={setMonth}
                        /* ─── 5) Usar parsedValue para defaultMonth ─── */
                        defaultMonth={parsedValue}
                        startMonth={start}
                        endMonth={end}
                        className="overflow-hidden rounded-lg border border-border p-2 bg-background"
                        classNames={{
                            month_caption: "ms-2.5 me-20 justify-start",
                            nav: "justify-end",
                        }}
                        components={{
                            CaptionLabel: (props: CaptionLabelProps) => (
                                <CaptionLabel
                                    {...props}
                                    isYearView={viewYear}
                                    setIsYearView={setViewYear}
                                />
                            ),
                            MonthGrid: (props: MonthGridProps) => (
                                <MonthGrid
                                    {...props}
                                    isYearView={viewYear}
                                    setIsYearView={setViewYear}
                                    startDate={start}
                                    endDate={end}
                                    years={years}
                                    currentYear={month.getFullYear()}
                                    currentMonth={month.getMonth()}
                                    onMonthSelect={(m) => {
                                        setMonth(m);
                                        setViewYear(false);
                                    }}
                                    currentYearRef={currentYearRef}
                                    currentMonthRef={currentMonthRef}
                                    scrollRef={scrollRef}
                                >
                                    {props.children}
                                </MonthGrid>
                            ),
                        }}
                    />
                </PopoverContent>
            </PopoverPortal>
        </Popover>
    );
}

function CaptionLabel({
    children,
    isYearView,
    setIsYearView,
}: {
    isYearView: boolean;
    setIsYearView: React.Dispatch<React.SetStateAction<boolean>>;
} & React.HTMLAttributes<HTMLSpanElement>) {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-sm font-medium hover:bg-transparent
                data-[state=open]:text-muted-foreground/80 [&[data-state=open]>svg]:rotate-180"
            onClick={() => setIsYearView((v) => !v)}
            data-state={isYearView ? "open" : "closed"}
        >
            {children}
            <ChevronDown size={16} strokeWidth={2} className="text-muted-foreground/80" />
        </Button>
    );
}

function MonthGrid({
    className,
    children,
    isYearView,
    startDate,
    endDate,
    years,
    currentYear,
    currentMonth,
    onMonthSelect,
    currentYearRef,
    currentMonthRef,
    scrollRef,
}: {
    className?: string;
    children: React.ReactNode;
    isYearView: boolean;
    setIsYearView: React.Dispatch<React.SetStateAction<boolean>>;
    startDate: Date;
    endDate: Date;
    years: Date[];
    currentYear: number;
    currentMonth: number;
    onMonthSelect: (d: Date) => void;
    currentYearRef: React.RefObject<HTMLDivElement | null>;
    currentMonthRef: React.RefObject<HTMLButtonElement | null>;
    scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
    return (
        <div className="relative">
            <table className={className}>{children}</table>
            {isYearView && (
                <div className="absolute inset-0 z-20 -mx-2 -mb-2 bg-background">
                    <ScrollArea ref={scrollRef} className="h-full">
                        {years.map((year) => {
                            const months = eachMonthOfInterval({
                                start: startOfYear(year),
                                end: endOfYear(year),
                            });
                            const isCurrYear = year.getFullYear() === currentYear;
                            return (
                                <div key={year.getFullYear()} ref={isCurrYear ? currentYearRef : undefined}>
                                    <Collapsible className="border-t border-border px-2 py-1.5" defaultOpen={isCurrYear}>
                                        <CollapsibleTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex w-full justify-start gap-2 text-sm font-medium hover:bg-transparent [&[data-state=open]>svg]:rotate-180"
                                            >
                                                <ChevronDown size={16} className="text-muted-foreground/80" />
                                                {year.getFullYear()}
                                            </Button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="overflow-hidden px-3 py-1 text-sm">
                                            <div className="grid grid-cols-3 gap-2">
                                                {months.map((m) => {
                                                    const disabled = isBefore(m, startDate) || isAfter(m, endDate);
                                                    const isCurrMonth =
                                                        m.getMonth() === currentMonth && m.getFullYear() === currentYear;
                                                    return (
                                                        <Button
                                                            key={m.getTime()}
                                                            variant={isCurrMonth ? "default" : "outline"}
                                                            size="sm"
                                                            className="h-7"
                                                            disabled={disabled}
                                                            ref={isCurrMonth ? currentMonthRef : undefined}
                                                            onClick={() => onMonthSelect(m)}
                                                        >
                                                            {format(m, "MMM")}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>
                            );
                        })}
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}