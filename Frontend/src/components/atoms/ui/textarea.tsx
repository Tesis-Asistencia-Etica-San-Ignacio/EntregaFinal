import * as React from "react";
import { cn } from "@/lib/utils";
import { checkSpellingWithLT, LTMatch } from "@/lib/api/languageApi";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoAdjust?: boolean;
  onSpellCheck?: (matches: LTMatch[]) => void;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoAdjust = false, onSpellCheck, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

    const finalClass = cn(
      "border-border placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-transparent flex min-h-16 w-full rounded-md border px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      autoAdjust ? "resize-y" : "resize-none",
      className
    );

    /* ─── auto-resize opcional ─── */
    const adjustSize = React.useCallback(() => {
      if (!autoAdjust || !innerRef.current) return;
      const el = innerRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [autoAdjust]);

    React.useLayoutEffect(adjustSize, [adjustSize, props.value]);

    const handleBlur = async (
      e: React.FocusEvent<HTMLTextAreaElement, Element>
    ) => {
      props.onBlur?.(e);
      if (onSpellCheck) {
        try {
          const matches = await checkSpellingWithLT(e.currentTarget.value);
          onSpellCheck(matches);
        } catch (err) {
          console.error(err);
        }
      }
    };

    return (
      <textarea
        {...props}
        ref={innerRef}
        className={finalClass}
        spellCheck
        onInput={adjustSize}
        onBlur={handleBlur}
      />
    );
  }
);

Textarea.displayName = "Textarea";
