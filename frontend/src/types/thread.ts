import type { Category } from "@/types/category";
export type Thread = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  category: Category | null;
};
