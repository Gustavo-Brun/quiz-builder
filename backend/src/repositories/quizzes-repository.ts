import { Quizzes, Questions, QuestionAnswers } from '@prisma/client';
import { CreateQuizBody } from 'src/@dtos/default/quizzes.dto';

type QuizWithQuestions = Quizzes & { questionnaire: Questions[] };

type QuestionWithAnswers = Questions & {
  answers: QuestionAnswers[];
};

type QuizWithQuestionsAndAnswers = Quizzes & {
  questionnaire: QuestionWithAnswers[];
};

export abstract class QuizzesRepository {
  abstract getByTitle(title: string): Promise<Quizzes | null>;
  abstract create(data: CreateQuizBody): Promise<Quizzes | null>;
  abstract getAll(): Promise<QuizWithQuestions[]>;
  abstract getById(id: number): Promise<QuizWithQuestionsAndAnswers | null>;
  abstract delete(id: number): Promise<Quizzes>;
}
