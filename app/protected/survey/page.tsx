'use client';

import { useRouter } from 'next/navigation';
import SurveyForm from '@/components/survey-form';

export default function SurveyPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Parent Survey</h1>
      <SurveyForm
        onSuccess={(data) => {
          router.push('/submissions');
        }}
      />
    </div>
  );
}
