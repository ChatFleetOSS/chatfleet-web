"use client";

import { Logo } from "@/components/branding/logo";
import { cn } from "@/lib/utils";

type LoadingScreenProps = {
  message: string;
  className?: string;
};

export default function LoadingScreen({ message, className }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-dvh w-full items-center justify-center bg-background text-foreground",
        className,
      )}
    >
      <div className="relative flex w-full max-w-md flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
          <div className="size-72 animate-spin rounded-full border-[12px] border-primary/20 border-t-primary/90 border-l-primary/60 border-r-primary/40" />
          <div className="absolute">
            <Logo />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-base font-medium text-foreground">{message}</p>
          <p className="text-sm text-muted-foreground">
            Operated by ChatFleet — keeping your assistants in sync.
          </p>
        </div>
      </div>
    </div>
  );
}
