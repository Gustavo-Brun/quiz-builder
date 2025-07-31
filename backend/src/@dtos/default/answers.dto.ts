import { IsBoolean, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

import { AnswerType } from '@prisma/client';

export class AnswersDto {
  questionId?: number;

  @IsEnum(AnswerType, {
    message: `Invalid answer type provided. Must be one of: ${Object.values(AnswerType).join(
      ', '
    )}.`
  })
  @IsNotEmpty({ message: 'Answer type is required.' })
  type: AnswerType;

  @IsString({ message: 'Answer must be a string.' })
  @IsNotEmpty({ message: 'Answer content is required.' })
  @Length(1, 1000, {
    message: 'Answer content must be between 1 and 1000 characters long.'
  })
  answer: string;

  @IsBoolean({ message: 'IsCorrect must be a boolean value.' })
  @IsNotEmpty({ message: 'IsCorrect is required.' })
  isCorrect: boolean;
}
