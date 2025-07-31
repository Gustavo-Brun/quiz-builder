import { Module } from '@nestjs/common';
import { QuizzesController } from './controllers/quizzes.controller';

import { PrismaService } from './database/prisma.service';
import { QuizzesRepository } from './repositories/quizzes-repository';
import { PrismaQuizzesRepository } from './repositories/prisma/prisma-quizzes-repository';

@Module({
  imports: [],
  controllers: [QuizzesController],
  providers: [
    PrismaService,
    {
      provide: QuizzesRepository,
      useClass: PrismaQuizzesRepository,
    },
  ],
})
export class AppModule {}
