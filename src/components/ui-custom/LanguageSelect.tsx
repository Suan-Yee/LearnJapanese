import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type LanguagePref = "en" | "mm" | "both";

interface LanguageSelectProps {
  value: LanguagePref;
  onChange: (value: LanguagePref) => void;
}

export function LanguageSelect({ value, onChange }: LanguageSelectProps) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as LanguagePref)}>
      <SelectTrigger className="h-12 w-full rounded-xl border-border/50 bg-card/70 font-semibold shadow-sm backdrop-blur-md transition-all hover:bg-card focus:ring-primary sm:w-[160px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-border/50 bg-card/95 shadow-xl backdrop-blur-xl">
        <SelectItem value="both">Both (EN & MM)</SelectItem>
        <SelectItem value="en">English Only</SelectItem>
        <SelectItem value="mm">Burmese Only</SelectItem>
      </SelectContent>
    </Select>
  );
}
