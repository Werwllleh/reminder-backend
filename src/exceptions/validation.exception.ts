import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(messages: string[]) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: messages,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
