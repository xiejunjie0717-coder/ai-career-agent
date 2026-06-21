import { useId } from "react";

import { cn } from "@/lib/utils";

type PathwiseLogoProps = {
  className?: string;
  tone?: "brand" | "mono" | "inverse";
  size?: number;
  title?: string;
  animated?: boolean;
};

export function PathwiseLogo({
  className,
  tone = "brand",
  size = 32,
  title = "Pathwise Career",
  animated = false,
}: PathwiseLogoProps) {
  const titleId = useId();
  const labelled = Boolean(title);

  return (
    <svg
      className={cn("pathwise-mark", animated && "pathwise-mark--animated", className)}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role={labelled ? "img" : undefined}
      aria-labelledby={labelled ? titleId : undefined}
      aria-hidden={labelled ? undefined : true}
      data-tone={tone}
    >
      {labelled ? <title id={titleId}>{title}</title> : null}
      <path
        className="pathwise-mark__route"
        d="M8 26V8.5C8 6.57 9.57 5 11.5 5h7.25A5.25 5.25 0 0 1 24 10.25v.5A5.25 5.25 0 0 1 18.75 16H8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <rect
        className="pathwise-mark__node"
        x="20.5"
        y="21.5"
        width="6"
        height="6"
        rx="0.75"
        fill="currentColor"
      />
    </svg>
  );
}
