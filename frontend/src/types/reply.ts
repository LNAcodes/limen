import type { Author } from "@/types/author";

export type Reply = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author | null;
};
