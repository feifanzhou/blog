export interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  author: string;
}

export interface BlogPostMeta {
  title: string;
  date: string;
  published: boolean;
  tags: string[];
  author: string;
  excerpt?: string;
  hero_image?: string;
}
