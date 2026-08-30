/**
 * The equalizer mark is Songcraft's signature element: four bars that read
 * as a live audio meter. Used as the app icon, and set to `live` wherever
 * something is actively generating or playing.
 */
export function AppMark({
  live = false,
  className = "",
}: {
  live?: boolean;
  className?: string;
}) {
  return (
    <span className={`eq-mark ${live ? "eq-live" : ""} ${className}`} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
