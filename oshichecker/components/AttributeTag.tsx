"use client";

import { AttributeKey, getAttributeLabel, getAttributeColor, isValidAttributeKey } from "@/lib/attributes";
import { Locale } from "@/i18n.config";

interface AttributeTagProps {
  attributeKey: string;
  locale: Locale;
  size?: "sm" | "md";
  showColor?: boolean;
}

export default function AttributeTag({
  attributeKey,
  locale,
  size = "sm",
  showColor = true,
}: AttributeTagProps) {
  // 有効な属性キーかチェック
  if (!isValidAttributeKey(attributeKey)) {
    return (
      <span
        className={`inline-flex w-fit items-center whitespace-nowrap rounded-full bg-gray-200 text-gray-600 leading-tight ${
          size === "sm"
            ? "px-1 py-[2px] text-[11px]"
            : "px-1.5 py-[3px] text-sm"
        }`}
      >
        {attributeKey}
      </span>
    );
  }

  const label = getAttributeLabel(attributeKey, locale);
  const color = getAttributeColor(attributeKey);

  return (
    <span
      className={`inline-flex w-fit items-center whitespace-nowrap rounded-full font-medium leading-tight ${
        size === "sm"
          ? "px-1 py-[2px] text-[11px]"
          : "px-1.5 py-[3px] text-sm"
      }`}
      style={{
        backgroundColor: showColor ? `${color}20` : undefined,
        color: showColor ? color : undefined,
        border: showColor ? `1px solid ${color}40` : undefined,
      }}
    >
      {label}
    </span>
  );
}

interface AttributeTagListProps {
  tags: string[];
  locale: Locale;
  size?: "sm" | "md";
  maxDisplay?: number;
  showAll?: boolean;
  direction?: "row" | "col";
}

export function AttributeTagList({
  tags,
  locale,
  size = "sm",
  maxDisplay = 3,
  showAll = false,
  direction = "row",
}: AttributeTagListProps) {
  // tagsがundefinedまたは空の場合は何も表示しない
  if (!tags || tags.length === 0) {
    return null;
  }

  const displayTags = showAll ? tags : tags.slice(0, maxDisplay);
  const remainingCount = showAll ? 0 : tags.length - maxDisplay;

  const containerClass =
    direction === "col" ? "flex flex-col gap-1" : "flex flex-wrap gap-1";

  return (
    <div className={containerClass}>
      {displayTags.map((tag) => (
        <AttributeTag
          key={tag}
          attributeKey={tag}
          locale={locale}
          size={size}
        />
      ))}
      {remainingCount > 0 && (
        <span className={`inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 ${
          size === "sm" ? "text-xs" : "text-sm"
        }`}>
          +{remainingCount}
        </span>
      )}
    </div>
  );
}
