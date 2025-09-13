export type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string; // ISO date
  linkedinUrl?: string;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
  tags?: string[];
  leadId?: string; // Reference to the lead who posted this
};
