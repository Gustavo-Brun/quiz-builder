import {
  IsNotEmpty,
  Length,
  IsString,
  ValidateNested,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

import { QuestionsDto } from './questions.dto';

export class CreateQuizBody {
  @IsString({
    message: 'Title must be a string',
  })
  @IsNotEmpty({
    message: 'title is required',
  })
  @Length(3, 255, {
    message: 'Title must be between 3 and 255 characters long',
  })
  @MinLength(3, {
    message: 'Title must be at least 3 characters long',
  })
  @MaxLength(255, {
    message: 'Title cannot be longer than 255 characters',
  })
  quizTitle: string;

  @ValidateNested()
  @Type(() => QuestionsDto)
  questionnaire: QuestionsDto[];
}
