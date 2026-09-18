/**
 * Renders a monochrome PNG/SVG as a solid-colour icon via CSS mask-image,
 * so it inherits colour from `currentColor` (i.e. a text-* className) the
 * same way a Lucide icon does — a drop-in swap for custom artwork.
 */
export function MaskIcon({
  src,
  size = 20,
  className = "",
}: {
  src: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
