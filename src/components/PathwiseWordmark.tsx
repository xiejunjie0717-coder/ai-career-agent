import { PathwiseLogo } from "@/components/PathwiseLogo";
import { cn } from "@/lib/utils";

type PathwiseWordmarkProps = {
  className?: string;
  mode?: "full" | "compact" | "icon";
  tone?: "brand" | "mono" | "inverse";
  animated?: boolean;
  markSize?: number;
};

export function PathwiseWordmark({
  className,
  mode = "full",
  tone = "brand",
  animated = false,
  markSize = 32,
}: PathwiseWordmarkProps) {
  if (mode === "icon") {
    return <PathwiseLogo className={className} tone={tone} size={markSize} animated={animated} />;
  }

  return (
    <span
      className={cn("pathwise-wordmark", animated && "pathwise-wordmark--animated", className)}
      data-tone={tone}
      aria-label="Pathwise Career"
    >
      <PathwiseLogo
        className="pathwise-wordmark__mark"
        tone={tone}
        size={markSize}
        animated={animated}
        title=""
      />
      <span className="pathwise-wordmark__type">
        <span className="pathwise-wordmark__pathwise">Pathwise</span>
        <span className="pathwise-wordmark__career">Career</span>
      </span>
    </span>
  );
}
