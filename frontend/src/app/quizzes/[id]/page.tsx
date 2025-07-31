'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { ArrowLeft, CheckCircle, Circle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IResponseParsed, Question, Quiz } from '@/types/default';
import { formatDate } from '@/utils/formatters';

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<
    | (Quiz & {
        questionnaire: Question[];
      })
    | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchQuiz(params.id as string);
    }
  }, [params.id]);

  const fetchQuiz = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.BASE_URL}/quizzes/${id}`);
      if (response.ok) {
        const responseParsed: IResponseParsed<
          Quiz & {
            questionnaire: Question[];
          }
        > = await response.json();

        if (responseParsed?.hasError) {
          console.log(responseParsed);
          return toast(responseParsed.errorMessage, { position: 'top-right' });
        }

        setQuiz(responseParsed.data);
      } else if (response.status === 404) {
        toast('Quiz not found', { position: 'top-right' });
        router.push('/quizzes');
      } else {
        toast('Failed to fetch quiz', { position: 'top-right' });
      }
    } catch (error) {
      console.log(error);
      toast('Failed to load quiz', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'boolean':
        return 'True/False';
      case 'input':
        return 'Short Answer';
      case 'checkbox':
        return 'Multiple Choice';
      default:
        return type;
    }
  };

  const renderQuestionPreview = (question: Question) => {
    return (
      <Card
        key={question.id}
        className="mb-4"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Question {question.id}</CardTitle>
            <Badge variant="secondary">{getQuestionTypeLabel(question.answerType)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base font-medium">{question.question}</p>

          {question.answerType === 'BOOLEAN' && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Answer format: True/False</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {question.answers[0].isCorrect ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="text-muted-foreground h-4 w-4" />
                  )}
                  <span
                    className={
                      question.answers[0].isCorrect
                        ? 'font-medium text-green-700'
                        : 'text-muted-foreground'
                    }
                  >
                    True
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {question.answers[1].isCorrect ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="text-muted-foreground h-4 w-4" />
                  )}
                  <span
                    className={
                      question.answers[1].isCorrect
                        ? 'font-medium text-green-700'
                        : 'text-muted-foreground'
                    }
                  >
                    False
                  </span>
                </div>
              </div>
            </div>
          )}

          {question.answerType === 'INPUT' && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Answer format: Short text</p>
              <div className="rounded-md border border-green-200 bg-green-50 p-3">
                <p className="text-sm text-green-800">
                  <strong>Correct answer:</strong> {question.answers[0].answer}
                </p>
              </div>
            </div>
          )}

          {question.answerType === 'CHECKBOX' && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                Answer format: Multiple choice (select all correct)
              </p>
              <div className="space-y-2">
                {question.answers.map((answer, index) => {
                  const isCorrect = answer.isCorrect;

                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-2"
                    >
                      {isCorrect ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="text-muted-foreground h-4 w-4" />
                      )}
                      <span
                        className={
                          isCorrect ? 'font-medium text-green-700' : 'text-muted-foreground'
                        }
                      >
                        {answer.answer}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-lg">Loading quiz...</div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Quiz not found</h1>
          <Button onClick={() => router.push('/quizzes')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/quizzes')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quizzes
        </Button>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <div className="text-muted-foreground flex items-center space-x-4">
            <span>
              {quiz.questionnaire.length} question{quiz.questionnaire.length !== 1 ? 's' : ''}
            </span>
            <span>•</span>
            <span>
              Created{' '}
              {formatDate(quiz.createdAt, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is a preview of your quiz structure. The questions are displayed in read-only
              mode showing the correct answers for reference.
            </p>
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">Questions</h2>
          {quiz.questionnaire
            .sort((a, b) => a.id - b.id)
            .map((q) => {
              return renderQuestionPreview(q);
            })}
        </div>
      </div>
    </div>
  );
}
