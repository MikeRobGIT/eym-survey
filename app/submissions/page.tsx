import { Metadata } from 'next';
import SurveySubmissions from '@/components/survey-submissions';

export const metadata: Metadata = {
  title: 'My Submissions | EYM',
  description: 'View and manage your survey submissions',
};

export default function SubmissionsPage() {
  return <SurveySubmissions />;
}
