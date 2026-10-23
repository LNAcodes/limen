import type { Category } from "@/types/category";
import type { Author } from "@/types/author";

export type Thread = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  category: Category | null;
  author: Author | null;
};
