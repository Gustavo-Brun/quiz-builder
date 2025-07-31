'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useForm, SubmitHandler } from 'react-hook-form';

type QuestionType = 'boolean' | 'input' | 'checkbox';

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correct_answer: string | string[];
}

type FormProps = {
  quizTitle: string;
  questions: {
    title: string;
    type: QuestionType;
    correct_answer: string | string[];
  }[];
};

export default function CreateQuizPage() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      type: 'boolean',
      question: '',
      correct_answer: ''
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormProps>();

  const onSubmitFx: SubmitHandler<FormProps> = async (data) => {
    if (!data.quizTitle.trim()) {
      toast('Please enter a quiz title', { position: 'top-right' });
      return;
    }

    const invalidQuestions = questions.filter(
      (q) =>
        !q.question.trim() ||
        (q.type === 'checkbox' && (!q.options || q.options.some((opt) => !opt.trim()))) ||
        (q.type === 'checkbox' &&
          Array.isArray(q.correct_answer) &&
          q.correct_answer.length === 0) ||
        (q.type !== 'checkbox' && !q.correct_answer)
    );

    if (invalidQuestions.length > 0) {
      toast('Please fill in all question fields and provide correct answers', {
        position: 'top-right'
      });
      return;
    }

    setIsSubmitting(true);

    const questionnaire = questions.map((q) => ({
      question: q.question,
      answerType: q.type.toUpperCase(),
      answers:
        q.type === 'boolean'
          ? [
              {
                type: 'BOOLEAN',
                answer: 'true',
                isCorrect: q.correct_answer === 'true'
              },
              {
                type: 'BOOLEAN',
                answer: 'false',
                isCorrect: q.correct_answer === 'false'
              }
            ]
          : q.type === 'input'
            ? [
                {
                  type: 'INPUT',
                  answer: q.correct_answer as string,
                  isCorrect: true
                }
              ]
            : // CHECKBOX
              q.options?.map((opt) => ({
                type: 'CHECKBOX',
                answer: opt,
                isCorrect: (q.correct_answer as string[]).includes(opt)
              }))
    }));

    try {
      const response = await fetch(`${process.env.BASE_URL}/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quizTitle: data.quizTitle,
          questionnaire
        })
      });

      if (response.ok) {
        toast('Quiz created successfully!', { position: 'top-right' });
        router.push('/quizzes');
      } else {
        throw new Error('Failed to create quiz');
      }
    } catch (error) {
      console.error(error);
      toast('Failed to create quiz. Please try again.', { position: 'top-right' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'boolean',
      question: '',
      correct_answer: ''
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: keyof Question, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          const updated = { ...q, [field]: value };

          // Reset correct_answer when type changes
          if (field === 'type') {
            updated.correct_answer = value === 'checkbox' ? [] : '';
            if (value !== 'checkbox') {
              delete updated.options;
            } else {
              updated.options = [''];
            }
          }

          return updated;
        }
        return q;
      })
    );
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.options) {
          return { ...q, options: [...q.options, ''] };
        }
        return q;
      })
    );
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.options && q.options.length > 1) {
          const newOptions = q.options.filter((_, index) => index !== optionIndex);
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const handleCheckboxAnswerChange = (questionId: string, option: string, checked: boolean) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const currentAnswers = Array.isArray(q.correct_answer) ? q.correct_answer : [];
          let newAnswers;

          if (checked) {
            newAnswers = [...currentAnswers, option];
          } else {
            newAnswers = currentAnswers.filter((answer) => answer !== option);
          }

          return { ...q, correct_answer: newAnswers };
        }
        return q;
      })
    );
  };

  const renderQuestionForm = (question: Question, index: number) => {
    return (
      <Card
        key={question.id}
        className="mb-4"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
          {questions.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeQuestion(question.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={`question-${question.id}`}>Question</Label>
            <Textarea
              id={`question-${question.id}`}
              value={question.question}
              onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
              placeholder="Enter your question..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`type-${question.id}`}>Question Type</Label>
            <Select
              value={question.type}
              onValueChange={(value: QuestionType) => updateQuestion(question.id, 'type', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boolean">True/False</SelectItem>
                <SelectItem value="input">Short Text Answer</SelectItem>
                <SelectItem value="checkbox">Multiple Choice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {question.type === 'boolean' && (
            <div>
              <Label>Correct Answer</Label>
              <RadioGroup
                value={question.correct_answer as string}
                onValueChange={(value) => updateQuestion(question.id, 'correct_answer', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="true"
                    id={`true-${question.id}`}
                  />
                  <Label htmlFor={`true-${question.id}`}>True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="false"
                    id={`false-${question.id}`}
                  />
                  <Label htmlFor={`false-${question.id}`}>False</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {question.type === 'input' && (
            <div>
              <Label htmlFor={`answer-${question.id}`}>Correct Answer</Label>
              <Input
                id={`answer-${question.id}`}
                value={question.correct_answer as string}
                onChange={(e) => updateQuestion(question.id, 'correct_answer', e.target.value)}
                placeholder="Enter the correct answer..."
                className="mt-1"
              />
            </div>
          )}

          {question.type === 'checkbox' && (
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label>Answer Options</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(question.id)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Option
                  </Button>
                </div>
                {question.options?.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="mb-2 flex items-center space-x-2"
                  >
                    <Input
                      value={option}
                      onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                      className="flex-1"
                    />
                    {question.options && question.options.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(question.id, optionIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <Label>Correct Answers (select all that apply)</Label>
                <div className="mt-2 space-y-2">
                  {question.options
                    ?.filter((opt) => opt.trim())
                    .map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`correct-${question.id}-${optionIndex}`}
                          checked={
                            Array.isArray(question.correct_answer) &&
                            question.correct_answer.includes(option)
                          }
                          onCheckedChange={(checked) =>
                            handleCheckboxAnswerChange(question.id, option, checked as boolean)
                          }
                        />
                        <Label htmlFor={`correct-${question.id}-${optionIndex}`}>{option}</Label>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Create New Quiz</h1>
        <p className="text-muted-foreground">Build your quiz with multiple question types</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmitFx)}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                placeholder="Enter quiz title..."
                className="mt-1"
                {...register('quizTitle', {
                  required: true
                })}
              />
              {errors.quizTitle?.type === 'required' && (
                <p className="text-xs text-[#F31F69]">This field is required</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Questions</h2>
            <Button
              type="button"
              onClick={addQuestion}
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>

          {questions.map((question, index) => renderQuestionForm(question, index))}
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/quizzes')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Quiz'}
          </Button>
        </div>
      </form>
    </div>
  );
}
