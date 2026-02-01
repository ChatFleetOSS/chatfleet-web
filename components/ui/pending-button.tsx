"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof Button> & {
  isPending?: boolean;
  pendingLabel?: string;
};

export function PendingButton({ isPending, pendingLabel, children, className, ...rest }: Props) {
  const content = isPending ? (
    <span className="inline-flex items-center gap-2">
      <Spinner size="xs" />
      <span>{pendingLabel ?? children}</span>
    </span>
  ) : (
    children
  );

  return (
    <Button className={cn(className)} disabled={isPending || rest.disabled} aria-busy={isPending} {...rest}>
      {content}
    </Button>
  );
}
