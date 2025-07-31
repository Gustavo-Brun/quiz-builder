import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { CreateQuizBody } from '../@dtos/default/quizzes.dto';
import { QuizzesRepository } from '../repositories/quizzes-repository';

@Controller('/quizzes')
export class QuizzesController {
  constructor(private quizzesRepository: QuizzesRepository) {}

  @Post()
  async create(@Body() body: CreateQuizBody) {
    const { quizTitle, questionnaire } = body;

    try {
      const existingQuiz = await this.quizzesRepository.getByTitle(quizTitle);
      if (existingQuiz) {
        return {
          status: 501,
          errorCode: 'QUI-CR02',
          errorMessage: `A quiz with title '${quizTitle}' already exists.`
        };
      }

      const newQuiz = await this.quizzesRepository.create({
        quizTitle,
        questionnaire
      });

      return { data: newQuiz };
    } catch (error) {
      console.log('CREATE_QUIZ ', error);

      return {
        status: 500,
        errorCode: 'QUI-CR02',
        errorMessage: 'Unexpected error to create a new quiz.'
      };
    }
  }

  @Get()
  async getAll() {
    try {
      const quizzes = await this.quizzesRepository.getAll();

      const payload = quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        createdAt: quiz.createdAt,
        updatedAt: quiz.updatedAt,
        questionnaireLength: quiz.questionnaire.length
      }));

      return { data: payload };
    } catch (error) {
      console.log('GET_QUIZZES ', error);

      return {
        status: 500,
        errorCode: 'QUI-GA01',
        errorMessage: 'Unexpected error to get all quizzes.'
      };
    }
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    try {
      const quiz = await this.quizzesRepository.getById(Number(id));

      return { data: quiz };
    } catch (error) {
      console.log('GET_QUIZ_BY_ID ', error);

      return {
        status: 500,
        errorCode: 'QUI-GI01',
        errorMessage: 'Unexpected error to get a specific quiz.'
      };
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    try {
      const deletedProduct = await this.quizzesRepository.delete(Number(id));

      return { data: deletedProduct };
    } catch (error) {
      console.log('DELETE_QUIZ ', error);

      return {
        status: 500,
        errorCode: 'QUI-DE01',
        errorMessage: 'Unexpected error to delete a specific quiz.'
      };
    }
  }
}
