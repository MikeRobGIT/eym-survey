'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { EYMParentSurvey } from '@/types/survey';
import {
  createSurveySubmission,
  updateSurveySubmission,
} from '@/app/actions/survey';
import { useToast } from '@/hooks/use-toast';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  frequencies,
  grades,
  subjects,
  satisfactionLevels,
} from '@/lib/survey-constants';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

type FieldType = {
  onChange: (...event: any[]) => void;
  onBlur: () => void;
  value: any;
  name: string;
  ref: React.Ref<any>;
};
const formSchema = z.object({
  child_name: z.string().min(1, 'Child name is required'),
  grade: z.string().min(1, 'Grade is required'),
  subjects: z.array(z.string()).min(1, 'At least one subject is required'),
  overall_experience: z.coerce.number().min(1).max(5),
  communication_satisfaction: z
    .string()
    .min(1, 'Communication rating is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  feedback: z.string().optional(),
});

interface SurveyFormProps {
  submission?: EYMParentSurvey;
  onSuccess: (data: EYMParentSurvey) => void;
}

export default function SurveyForm({ submission, onSuccess }: SurveyFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      child_name: submission?.child_name ?? '',
      grade: submission?.grade ?? '',
      subjects: submission?.subjects ?? [],
      overall_experience: submission?.overall_experience ?? 5,
      communication_satisfaction: submission?.communication_satisfaction ?? '',
      frequency: submission?.frequency ?? '',
      feedback: submission?.feedback ?? '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = submission
        ? await updateSurveySubmission({ ...submission, ...values })
        : await createSurveySubmission(values);

      onSuccess(result);
      toast({
        title: 'Success',
        description: `Survey ${submission ? 'updated' : 'submitted'} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'Failed to submit survey, make sure you are not submitting duplicate entries.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Group */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="child_name"
              render={({ field }: { field: FieldType }) => (
                <FormItem>
                  <FormLabel>Child's Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter child's name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grade"
              render={({ field }: { field: FieldType }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Subjects Group */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Subjects</h2>
          <FormField
            control={form.control}
            name="subjects"
            render={({ field }: { field: FieldType }) => (
              <FormItem>
                <div className="grid gap-4 md:grid-cols-3">
                  {subjects.map((subject) => (
                    <FormField
                      key={subject.id}
                      control={form.control}
                      name="subjects"
                      render={({ field }) => (
                        <FormItem
                          key={subject.id}
                          className="flex items-center space-x-3 space-y-0 rounded-lg border p-4"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(subject.id)}
                              onCheckedChange={(checked) => {
                                const updatedSubjects = checked
                                  ? [...(field.value || []), subject.id]
                                  : field.value?.filter(
                                      (s: string) => s !== subject.id
                                    );
                                field.onChange(updatedSubjects);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {subject.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Experience & Satisfaction Group */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Experience & Satisfaction</h2>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="overall_experience"
              render={({ field }: { field: FieldType }) => (
                <FormItem className="space-y-4">
                  <div>
                    <FormLabel>Overall Experience</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Rate your overall experience from 1 to 5
                    </div>
                  </div>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                        className="w-[60%]"
                      />
                      <div className="w-12 text-center font-medium">
                        {field.value}/5
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="communication_satisfaction"
                render={({ field }: { field: FieldType }) => (
                  <FormItem>
                    <FormLabel>Communication Satisfaction</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select satisfaction level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {satisfactionLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }: { field: FieldType }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {frequencies.map((freq) => (
                          <SelectItem key={freq} value={freq}>
                            {freq}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Feedback Group */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Additional Feedback</h2>
          <FormField
            control={form.control}
            name="feedback"
            render={({ field }: { field: FieldType }) => (
              <FormItem>
                <FormLabel>Feedback (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Share any additional thoughts or feedback..."
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full md:w-auto">
          {submission ? 'Update Survey' : 'Submit Survey'}
        </Button>
      </form>
    </Form>
  );
}
