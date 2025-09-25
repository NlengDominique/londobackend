/* eslint-disable prettier/prettier */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import path from 'path';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>()

    let status: number;
    let message: string | string[];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : (res as { message?: string | string[] }).message || 'Erreur inconnue';
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
      console.error('Une erreur est survenue:', exception);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Erreur interne du serveur';
      console.error('Erreur interne du serveur', exception);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path:request.url,
      message,
    });
  }
}

