export interface BlogPost {
  id: number;
  title: string;
  content: string;
  slug: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  readTime?: string;
}

export interface BlogPostPreview {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  readTime?: string;
}

export interface BlogPostList {
  posts: BlogPostPreview[];
  totalCount: number;
  page: number;
  pageSize: number;
}
