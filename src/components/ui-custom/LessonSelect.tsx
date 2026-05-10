import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LessonOption {
  value: number;
  label?: string; // Optional custom label, defaults to "Lesson {value}"
}

interface LessonSelectProps {
  value: number;
  onChange: (value: number) => void;
  options: LessonOption[];
}

export function LessonSelect({ value, onChange, options }: LessonSelectProps) {
  return (
    <Select
      value={String(value)}
      onValueChange={(val) => onChange(Number(val))}
    >
      <SelectTrigger className="h-12 w-full rounded-xl border-border/50 bg-card/70 font-semibold text-primary shadow-sm backdrop-blur-md transition-all hover:bg-card focus:ring-primary sm:w-[220px]">
        <SelectValue placeholder="Select Lesson" />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-border/50 bg-card/95 shadow-xl backdrop-blur-xl">
        {options.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label || `Lesson ${option.value}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
