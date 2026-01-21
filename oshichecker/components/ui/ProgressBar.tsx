import { Locale } from "@/i18n.config";

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  size?: "sm" | "md";
  locale?: Locale;
}

export default function ProgressBar({
  current,
  total,
  showLabel = true,
  size = "md",
  locale = "ja",
}: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);

  const label =
    locale === "ko" ? "진행" : locale === "en" ? "Progress" : "進捗";

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">{label}</span>
          <span className="text-xs font-medium text-gray-600">
            {current} / {total}
          </span>
        </div>
      )}
      <div className={`progress-bar ${size === "sm" ? "h-1.5" : "h-2"}`}>
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
