import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ZodError } from 'zod';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof Error) {
      this.logger.error(exception.message);
    } else {
      this.logger.error(String(exception));
    }

    if (exception instanceof ZodError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        error: 'Validation failed',
        details: exception.issues,
      });
      return;
    }

    if (
      typeof exception === 'object' &&
      exception !== null &&
      (exception as { code?: unknown }).code === 'P2002'
    ) {
      response.status(HttpStatus.CONFLICT).json({
        error: 'A record with this value already exists',
      });
      return;
    }

    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      const message =
        typeof body === 'string'
          ? body
          : ((body as { message?: string | string[] }).message ??
            exception.message);

      response.status(exception.getStatus()).json({
        error: Array.isArray(message) ? message.join(', ') : message,
      });
      return;
    }

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Something went wrong' });
  }
}
