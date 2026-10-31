export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: number;
  section: string;
  sectionTitle: string;
  question: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export type ParticipantStatus = 'waiting' | 'in_progress' | 'submitted' | 'disqualified';

export interface Participant {
  id: string;
  username: string;
  phone: string;
  proof_url: string;
  status: ParticipantStatus;
  violations_count: number;
  score: number;
  correct_answers: number;
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  created_at: string;
  submitted_at: string | null;
  last_active?: string;
  disqualification_reason?: string | null;
}

export interface ExamSettings {
  id: string;
  is_open: boolean;
  announcement?: string;
  max_violations: number;
  updated_at?: string;
}
