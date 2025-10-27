"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminSectionProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
};

export const AdminSection = ({
  title,
  description,
  actions,
  defaultOpen = false,
  children,
}: AdminSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-lg border border-border bg-background">
      <div
        className={cn(
          "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
          open && "border-b border-border",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full flex-1 items-center justify-between gap-3 text-left"
          aria-expanded={open}
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-foreground">{title}</span>
            {description ? (
              <span className="text-xs text-muted-foreground">{description}</span>
            ) : null}
          </div>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
      {open ? <div className="px-4 py-4">{children}</div> : null}
    </section>
  );
};
