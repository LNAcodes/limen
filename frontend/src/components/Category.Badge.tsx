type CategoryBadgeProps = {
  categoryName: string;
};

// One color for all categories: the text carries the meaning, not the color.
// This also works for people with color vision deficiency.
export default function CategoryBadge({ categoryName }: CategoryBadgeProps) {
  return (
    <span className="inline-block self-start rounded-full bg-violet-50 px-2.5 py-0.5 text-sm font-medium text-violet-800 dark:bg-violet-950 dark:text-violet-200">
      {categoryName}
    </span>
  );
}
