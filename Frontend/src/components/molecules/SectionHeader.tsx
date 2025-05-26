import { CollapsibleTrigger } from "@/components/atoms/ui/collapsible";

export interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <CollapsibleTrigger asChild>
      <button
        type="button"
        className="w-full bg-white text-[#111827] p-4 rounded-md shadow border border-gray-300 text-left font-semibold"
      >
        {title}
      </button>
    </CollapsibleTrigger>
  );
}
