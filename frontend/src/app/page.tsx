import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, List, Eye } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Quiz Creation Platform</h1>
        <p className="text-muted-foreground mb-8 text-xl">
          Create, manage, and organize your quizzes with multiple question types
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/create">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Quiz
            </Button>
          </Link>
          <Link href="/quizzes">
            <Button
              variant="outline"
              size="lg"
            >
              <List className="mr-2 h-5 w-5" />
              View Quizzes
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5 text-blue-500" />
              Create Quizzes
            </CardTitle>
            <CardDescription>
              Build quizzes with multiple question types including true/false, short answer, and
              multiple choice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/create">
              <Button
                variant="outline"
                className="w-full bg-transparent"
              >
                Get Started
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <List className="mr-2 h-5 w-5 text-green-500" />
              Manage Quizzes
            </CardTitle>
            <CardDescription>
              View all your quizzes in one place, see question counts, and manage your quiz
              collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/quizzes">
              <Button
                variant="outline"
                className="w-full bg-transparent"
              >
                View Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5 text-purple-500" />
              Preview Quizzes
            </CardTitle>
            <CardDescription>
              View detailed quiz structures with questions and correct answers in read-only mode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/quizzes">
              <Button
                variant="outline"
                className="w-full bg-transparent"
              >
                Explore
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Supported Question Types</CardTitle>
          <CardDescription>Create diverse quizzes with these question formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold">True/False</h4>
              <p className="text-muted-foreground text-sm">
                Simple boolean questions with radio button selection
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Short Answer</h4>
              <p className="text-muted-foreground text-sm">
                Text input questions for brief written responses
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Multiple Choice</h4>
              <p className="text-muted-foreground text-sm">
                Checkbox questions with multiple correct answers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
