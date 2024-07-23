import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export default function Spinner({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        `w-14 h-14 rounded-full bg-transparent border-2 border-white border-b-slate-500 animate-spin ${className}`
      )}
    ></div>
  );
}
