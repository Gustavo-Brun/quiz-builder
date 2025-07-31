import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';

import { CreateQuizBody } from 'src/@dtos/default/quizzes.dto';
import { QuizzesRepository } from '../quizzes-repository';
import { Quizzes } from '@prisma/client';

@Injectable()
export class PrismaQuizzesRepository implements QuizzesRepository {
  constructor(private prisma: PrismaService) {}

  async getByTitle(title: string): Promise<Quizzes | null> {
    return await this.prisma.quizzes.findUnique({
      where: {
        title
      }
    });
  }

  create(data: CreateQuizBody) {
    return this.prisma.$transaction(async (tx) => {
      const quiz = await tx.quizzes.create({
        data: {
          title: data.quizTitle
        }
      });

      if (data.questionnaire.length === 0) {
        console.warn('Payload contains no questions. Creating quiz without questions.');
        return quiz;
      }

      for (const questionData of data.questionnaire) {
        await tx.questions.create({
          data: {
            question: questionData.question,
            answerType: questionData.answerType,
            quizId: quiz.id,
            answers: {
              createMany: {
                data: questionData.answers.map((answer) => ({
                  type: answer.type,
                  answer: answer.answer,
                  isCorrect: answer.isCorrect
                }))
              }
            }
          }
        });
      }

      return tx.quizzes.findUnique({
        where: {
          id: quiz.id
        }
      });
    });
  }

  async getAll() {
    return await this.prisma.quizzes.findMany({
      include: {
        questionnaire: true
      }
    });
  }

  async getById(id: number) {
    return await this.prisma.quizzes.findUnique({
      where: {
        id
      },
      include: {
        questionnaire: {
          include: {
            answers: true
          }
        }
      }
    });
  }

  async delete(id: number) {
    return await this.prisma.quizzes.delete({
      where: {
        id
      }
    });
  }
}
