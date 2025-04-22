
export type BlogStatus = 'draft' | 'published';

export type BlogSite = 'basira' | 'sustenance' | 'minimal-muslim';

export interface Blog {
  id: string;
  title: string;
  subheading: string;
  body: string; 
  images: string[];
  quotes?: string[];
  tags: string[];
  categories: string[];
  published_to: BlogSite[];
  status: BlogStatus;
  created_at: string;
  updated_at: string;
  author : string
  authorId : string
}

export interface BlogFormData {
  title: string;
  subheading: string;
  body: string;
  images: string[];
  author : string;
  authorId : string;
}

export interface BlogMetadataFormData {
  tags: string[];
  categories: string[];
  published_to: BlogSite[];
  status: BlogStatus;
}
