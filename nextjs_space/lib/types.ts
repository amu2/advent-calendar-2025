export interface AdventDay {
  day: number;
  date: string;
  dateDisplay: string;
  title: string;
  subtitle?: string;
  keyInsight?: string;
  intro?: string;
  content: string;
  closing?: string;
  type?: string;
  special?: string;
  centralFormula?: string;
  dependencies?: string;
  isLocked: boolean;
  references?: Array<{
    key: string;
    text: string;
  }>;
}

export interface AdventData {
  metadata: {
    year: number;
    theme: string;
    subtitle: string;
    author: string;
    email: string;
    description: string;
  };
  colorScheme: {
    adventRed: string;
    adventBlue: string;
    adventGreen: string;
    adventGold: string;
    background: string;
    text: string;
  };
  days: AdventDay[];
}
