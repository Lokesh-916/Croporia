import React from "react";
import { cn } from "../../lib/utils";

export const ShimmerButton = ({
  className,
  text,
  onClick,
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex h-12 animate-shimmer items-center justify-center rounded-xl border border-[#c8a000]/30 bg-[linear-gradient(110deg,#1a3d0a,45%,#2a5015,55%,#1a3d0a)] bg-[length:200%_100%] px-6 font-bold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#c8a000] focus:ring-offset-2 focus:ring-offset-white",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {text}
    </button>
  );
};
