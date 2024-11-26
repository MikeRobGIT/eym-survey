'use client';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string; code?: string };
  reset: () => void;
}) {
  const getErrorMessage = () => {
    if (error.name === 'SurveyError') {
      if (error.code === 'DUPLICATE_ENTRY') {
        return "You've already submitted a survey for this child. Please make sure you aren't adding a duplicate entry. Only one submission per child is allowed.";
      }
      return error.message;
    }
    return "We're sorry, but something went wrong. Please try again later.";
  };

  return (
    <html>
      <body>
        <div className="flex h-screen flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold text-red-600">
            Something went wrong!
          </h2>
          <p className="text-gray-600 text-center max-w-md">
            {getErrorMessage()}
          </p>
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
