/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import config from '../../config';

import handleValidationError from '../../errors/handleValidationError';
import IGenericErrorMessage from '../../interfaces/error';
import { ZodError } from 'zod';
import { handleZodError } from '../../errors/handleZodError';
import { handleCastError } from '../../errors/handleCastError';
import ApiError from '../../errors/ApiError';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import httpStatus from 'http-status';

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  config.env === 'development'
    ? console.log('globalErrorHandler', error)
    : console.error('globalErrorHandler', error);

  let statusCode = 500;
  let message = 'Something went wrong !';
  let errorMessages: IGenericErrorMessage[] = [];

  if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof JsonWebTokenError) {
    statusCode = 401;
    message = 'Invalid token';
    errorMessages = [
      {
        path: '',
        message: error.message,
      },
    ];
  } else if (error instanceof TokenExpiredError) {
    statusCode = 401;
    message = 'Token has expired';
    errorMessages = [
      {
        path: '',
        message: error.message,
      },
    ];
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error.code === 11000) {
    statusCode = 409;
    const field = Object.keys(error.keyValue)[0];
    (message = `${field} must be unique`),
      (errorMessages = [
        {
          path: field,
          message: `${field} must be unique`,
        },
      ]);
  } else if (error instanceof TypeError) {
    statusCode = 400;
    message = error.message;
    errorMessages = [
      {
        path: '',
        message: error.message,
      },
    ];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
