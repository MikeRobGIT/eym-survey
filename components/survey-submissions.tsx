'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getSurveySubmissions } from '@/app/actions/survey';
import { EYMParentSurvey } from '@/types/survey';
import { Badge } from '@/components/ui/badge';
import SurveyForm from './survey-form';
import { DeleteSurveyDialog } from '@/components/delete-survey-dialog';
import { Plus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';

const getSatisfactionColor = (rating: number) => {
  if (rating >= 4)
    return 'bg-green-500/10 text-green-700 hover:bg-green-500/30';
  if (rating >= 3)
    return 'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/30';
  return 'bg-red-500/10 text-red-700 hover:bg-red-500/30';
};

export default function SurveySubmissions() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<EYMParentSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await getSurveySubmissions();
      setSubmissions(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load submissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedSubmission: EYMParentSurvey) => {
    setSubmissions(
      submissions.map((sub) =>
        sub.id === updatedSubmission.id ? updatedSubmission : sub
      )
    );
    setEditDialogOpen(null);
  };

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  return (
    <div className="flex items-center justify-center p-2">
      <div className="space-y-4 w-full sm:w-96">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">My Submissions</h2>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button size="icon" className="rounded-full">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create new Survey</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Survey</DialogTitle>
              </DialogHeader>
              <SurveyForm
                onSuccess={() => {
                  loadSubmissions();
                  setCreateDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p>No submissions found.</p>
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <CardTitle>{submission.child_name}&apos;s Survey</CardTitle>
                <CardDescription>Grade: {submission.grade}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Subjects:</strong> {submission.subjects.join(', ')}
                  </p>
                  <div className="flex items-center gap-2">
                    <strong>Overall Experience:</strong>
                    <Badge
                      className={getSatisfactionColor(
                        Number(submission.overall_experience)
                      )}
                    >
                      {submission.overall_experience}/5
                    </Badge>
                  </div>
                  <p>
                    <strong>Communication:</strong>{' '}
                    {submission.communication_satisfaction}
                  </p>
                  <p>
                    <strong>Frequency:</strong> {submission.frequency}
                  </p>
                  {submission.feedback && (
                    <p>
                      <strong>Feedback:</strong> {submission.feedback}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="space-x-2">
                <Dialog
                  open={editDialogOpen === submission.id}
                  onOpenChange={(open) =>
                    setEditDialogOpen(open ? submission.id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">Edit</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Survey</DialogTitle>
                    </DialogHeader>
                    <SurveyForm
                      submission={submission}
                      onSuccess={handleUpdate}
                    />
                  </DialogContent>
                </Dialog>
                <DeleteSurveyDialog
                  surveyId={submission.id}
                  onDelete={loadSubmissions}
                />
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
