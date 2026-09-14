import { Star } from "lucide-react";

export function StarRating({
  value,
  size = 14,
  onChange,
}: {
  value: number;
  size?: number;
  onChange?: (v: number) => void;
}) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = value >= n - 0.25;
        const star = (
          <Star
            size={size}
            className={filled ? "fill-primary text-primary" : "text-muted-foreground"}
          />
        );
        return onChange ? (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            className="p-0.5 transition hover:scale-110"
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}
