import { cn } from "@/lib/utils";

/** Shared page gutter: 1120px max content width with 32px side padding. */
export function Wrap({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1120px] px-6 sm:px-8", className)}>
      {children}
    </div>
  );
}
