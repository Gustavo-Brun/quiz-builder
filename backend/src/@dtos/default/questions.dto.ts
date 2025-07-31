import {
  IsNotEmpty,
  Length,
  IsString,
  MinLength,
  MaxLength,
  ValidateNested,
  IsEnum
} from 'class-validator';
import { Type } from 'class-transformer';

import { AnswersDto } from './answers.dto';
import { AnswerType } from '@prisma/client';

export class QuestionsDto {
  @IsString({
    message: 'Question must be a string'
  })
  @IsNotEmpty({
    message: 'Question is required'
  })
  @Length(3, 255, {
    message: 'Question must be between 3 and 255 characters long'
  })
  @MinLength(3, {
    message: 'Question must be at least 3 characters long'
  })
  @MaxLength(255, {
    message: 'Question cannot be longer than 255 characters'
  })
  question: string;

  @IsEnum(AnswerType, {
    message: `Invalid answer type provided. Must be one of: ${Object.values(AnswerType).join(
      ', '
    )}.`
  })
  @IsNotEmpty({
    message: 'Answer type is required'
  })
  answerType: AnswerType;

  @ValidateNested({ each: true })
  @Type(() => AnswersDto)
  answers: AnswersDto[];
}
