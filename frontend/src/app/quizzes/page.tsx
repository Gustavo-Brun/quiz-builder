'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { Trash2, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';

import { IResponseParsed, Quiz } from '@/types/default';
import { formatDate } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<
    (Quiz & {
      questionnaireLength: number;
    })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.BASE_URL}/quizzes`, {
        method: 'GET'
      });

      if (response.ok) {
        const responseParsed: IResponseParsed<
          (Quiz & {
            questionnaireLength: number;
          })[]
        > = await response.json();

        if (responseParsed?.hasError) {
          console.log(responseParsed);
          return toast(responseParsed.errorMessage, { position: 'top-right' });
        }

        setQuizzes(responseParsed.data);
      } else {
        toast('Failed to fetch quizzes', { position: 'top-right' });
      }
    } catch (error) {
      console.log(error);
      toast('Failed to load quizzes', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const deleteQuiz = async (id: number) => {
    setDeletingId(id);
    try {
      const response = await fetch(`${process.env.BASE_URL}/quizzes/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast('Quiz deleted successfully', { position: 'top-right' });
        fetchQuizzes();
      } else {
        toast('Failed to delete quiz', { position: 'top-right' });
      }
    } catch (error) {
      console.log(error);
      toast('Failed to delete quiz', { position: 'top-right' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-lg">Loading quizzes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Quiz Dashboard</h1>
          <p className="text-muted-foreground">Manage your quizzes</p>
        </div>
        <Link href="/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <div className="text-muted-foreground mb-4">
              <div className="mb-4 text-6xl">📝</div>
              <h3 className="mb-2 text-xl font-semibold">No quizzes yet</h3>
              <p>Create your first quiz to get started</p>
            </div>
            <Link href="/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Quiz
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="transition-shadow hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-2 text-lg">{quiz.title}</CardTitle>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 hover:text-red-700"
                        disabled={deletingId === quiz.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{quiz.title}&quot;? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteQuiz(quiz.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-muted-foreground flex items-center justify-between text-sm">
                    <span>
                      {quiz.questionnaireLength} question{quiz.questionnaireLength !== 1 ? 's' : ''}
                    </span>
                    <span>
                      {formatDate(quiz.createdAt, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <Link href={`/quizzes/${quiz.id}`}>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Quiz
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
