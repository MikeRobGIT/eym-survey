'use client';

import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { submitParentSurvey } from '@/app/actions/survey';
import { subjects, grades, frequencies } from '@/lib/survey-constants';

interface SurveyData {
  grade: string;
  subjects: string[];
  frequency: string;
  feedback?: string;
  child_name: string;
  overall_experience: number;
  communication_satisfaction: string;
}

export default function EYMParentSurvey() {
  const { toast } = useToast();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus('loading');

    const formData = new FormData(event.currentTarget);
    const surveyData: Partial<SurveyData> = Object.fromEntries(
      formData.entries()
    ) as Partial<SurveyData>;

    surveyData.subjects = selectedSubjects;
    const overallExperience = formData.get('overall_experience');
    if (overallExperience) {
      surveyData.overall_experience = parseInt(overallExperience.toString());
    }

    try {
      await submitParentSurvey(surveyData as SurveyData);
      setSubmitStatus('success');
      toast({
        title: 'Survey Submitted Successfully',
        description: 'Thank you for submitting your feedback!',
        variant: 'default',
      });
    } catch (error) {
      setSubmitStatus('error');
      toast({
        title: 'Submission Failed',
        description:
          'Failed to submit survey, make sure you are not submitting duplicate entries.',
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Educating Young Minds (EYM) Parent Survey</CardTitle>
        <CardDescription>
          Please provide your feedback to help us improve our tutoring services.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="child_name">Child's Name</Label>
            <Input
              id="child_name"
              name="child_name"
              required
              spellCheck="false"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Child's Grade</Label>
            <Select name="grade" required>
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subjects Showing Improvement</Label>
            <div className="grid grid-cols-2 gap-2">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject.id}
                    checked={selectedSubjects.includes(subject.id)}
                    onCheckedChange={() => handleSubjectChange(subject.id)}
                  />
                  <Label htmlFor={subject.id}>{subject.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="overall_experience">
              Overall Experience Rating
            </Label>
            <Slider
              id="overall_experience"
              name="overall_experience"
              defaultValue={[3]}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Satisfaction with EYM's Communication</Label>
            <RadioGroup name="communication_satisfaction" required>
              {[
                'Very Satisfied',
                'Satisfied',
                'Neutral',
                'Dissatisfied',
                'Very Dissatisfied',
              ].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`comm-${option}`} />
                  <Label htmlFor={`comm-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency of Tutoring Sessions</Label>
            <Select name="frequency" required>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((freq) => (
                  <SelectItem key={freq} value={freq}>
                    {freq}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Additional Feedback or Suggestions</Label>
            <Textarea
              id="feedback"
              name="feedback"
              placeholder="Please share any additional thoughts..."
              spellCheck="false"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={submitStatus === 'loading' || submitStatus === 'success'}
          >
            {submitStatus === 'loading' ? 'Submitting...' : 'Submit Survey'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
