export interface EYMParentSurvey {
  id: string;
  parent_id?: string;
  child_name: string;
  grade: string;
  subjects: string[];
  overall_experience: number;
  communication_satisfaction: string;
  frequency: string;
  feedback?: string | null;
  created_at?: string;
}
