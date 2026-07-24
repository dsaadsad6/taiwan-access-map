import { ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type CardProps<T extends ElementType> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export function Card<T extends ElementType = "div">({ as, className, ...props }: CardProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900",
        className
      )}
      {...props}
    />
  );
}
