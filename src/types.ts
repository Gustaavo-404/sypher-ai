export type ContentFormat = 'linkedin_post' | 'professional_email' | 'blog_draft' | 'social_thread' | 'executive_summary';

export type ToneType = 'profissional' | 'persuasivo' | 'informal' | 'tecnico' | 'entusiasta';

export interface Draft {
  id: string;
  title: string;
  rawInput: string;
  generatedOutput: string;
  format: ContentFormat;
  tone: ToneType;
  customInstructions?: string;
  createdAt: number;
  wordCount: number;
  tags: string[];
}

export interface ContentTemplate {
  id: ContentFormat;
  label: string;
  iconName: string;
  description: string;
  placeholder: string;
}

export interface ToneOption {
  id: ToneType;
  label: string;
  description: string;
  colorClass: string;
}

export interface FeatureLimit {
  draftsUsed: number;
  draftsLimit: number;
  wordsUsed: number;
  wordsLimit: number;
  aiCreditsUsed: number;
  aiCreditsLimit: number;
}

export interface SaaSUser {
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  limits: FeatureLimit;
  joinedAt: number;
}
