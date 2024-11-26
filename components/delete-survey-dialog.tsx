'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteSurveySubmission } from '@/app/actions/survey';
import { useToast } from '@/hooks/use-toast';

interface DeleteSurveyDialogProps {
  surveyId: string;
  onDelete?: () => void;
}

export function DeleteSurveyDialog({
  surveyId,
  onDelete,
}: DeleteSurveyDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteSurveySubmission(surveyId);
      toast({
        title: 'Survey deleted',
        description: 'The survey has been successfully deleted.',
      });
      onDelete?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete the survey. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Survey</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            survey submission.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
