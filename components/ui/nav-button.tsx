"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { PendingButton } from "@/components/ui/pending-button";

type Props = React.ComponentProps<typeof PendingButton> & {
  href: string;
  pendingLabel?: string;
};

export function NavButton({ href, pendingLabel, children, onClick, ...rest }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <PendingButton
      isPending={isPending}
      pendingLabel={pendingLabel}
      onClick={(e) => {
        onClick?.(e as any);
        if (e.defaultPrevented) return;
        startTransition(() => router.push(href));
      }}
      {...rest}
    >
      {children}
    </PendingButton>
  );
}

