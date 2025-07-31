export interface IResponseParsed<T> {
  hasError: boolean;
  errorCode?: string;
  errorMessage?: string;
  data: T;
}

export interface Quiz {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}
 
export interface Question {
  id: number;
  quizId: number;
  question: string;
  answerType: 'BOOLEAN' | 'INPUT' | 'CHECKBOX';
  answers: Answers[];
  createdAt: string;
  updatedAt: string;
}

export interface Answers {
  id: string;
  questionId: number;
  type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX';
  answer: string;
  isCorrect: boolean;
}
