'use client';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDuplicateError = error.message?.includes(
    'already submitted a survey for this child'
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
      <p className="text-gray-600 text-center max-w-md">
        {process.env.NODE_ENV === 'development'
          ? error.message
          : isDuplicateError
            ? "You've already submitted a survey for this child. Please make sure you aren't adding a duplicate entry. Only one submission per child is allowed."
            : "We're sorry, but something went wrong. Please try again later."}
      </p>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
