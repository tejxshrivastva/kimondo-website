import { formatPrice } from "@/lib/utils";

export function PriceDisplay({
  paise,
  prefix,
  className = "",
}: {
  paise: number;
  prefix?: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {prefix}
      {formatPrice(paise)}
    </span>
  );
}
