import { cn } from "@/lib/cn";

/** Centered, width-constrained content wrapper used across the site. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-4 sm:px-6", className)}>{children}</div>
  );
}
