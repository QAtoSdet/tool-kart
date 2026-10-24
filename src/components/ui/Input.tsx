import { cn } from "@/lib/cn";

const inputBase =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const { className, ...rest } = props;
  return <input className={cn(inputBase, className)} {...rest} />;
};

export const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  const { className, ...rest } = props;
  return <select className={cn(inputBase, className)} {...rest} />;
};

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
    </div>
  );
}
