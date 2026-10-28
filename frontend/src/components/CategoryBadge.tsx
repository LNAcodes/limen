type CategoryBadgeProps = {
  categoryName: string;
};

// Each category gets its own color to make the list easier to scan.
// The text still carries the meaning, so the badge also works without color.
// Full class names are written out, because Tailwind only finds complete class names.
const categoryColors: Record<string, string> = {
  "Transition daycare to primary school":
    "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  "Transition primary to secondary school":
    "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
  "Cooperation between schools and youth welfare":
    "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-200",
  Inclusion:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  "All-day schooling":
    "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
};

// Used when a category is not in the list above (for example a new one)
const defaultColor =
  "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200";

export default function CategoryBadge({ categoryName }: CategoryBadgeProps) {
  // Look up the color for this category, or use grey if it is unknown
  const colorClasses = categoryColors[categoryName] ?? defaultColor;

  return (
    <span
      className={`inline-block self-start rounded-full px-2.5 py-0.5 text-sm font-medium ${colorClasses}`}
    >
      {categoryName}
    </span>
  );
}
