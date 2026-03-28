import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
  name: string;
  color: string;
  isDefault?: boolean;
}

export default function CategoryBadge({
  name,
  color,
  isDefault,
}: CategoryBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm font-medium">{name}</span>
      {isDefault && (
        <Badge variant="secondary" className="text-[10px]">
          Sistema
        </Badge>
      )}
    </div>
  );
}
