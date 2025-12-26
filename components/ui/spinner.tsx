import { cn } from "@/lib/utils";

export function Spinner({ size = "sm", className }: { size?: "xs" | "sm" | "md"; className?: string }) {
  const dims = size === "xs" ? "size-3" : size === "md" ? "size-5" : "size-4";
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-muted-foreground/30 border-b-current",
        dims,
        className,
      )}
    />
  );
}

