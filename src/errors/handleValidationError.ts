import mongoose from 'mongoose';
import { IGenericErrorResponse } from '../interfaces/common';
import IGenericErrorMessage from '../interfaces/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = Object.values(err.errors).map(
    (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: el?.path,
        message: el?.message,
      };
    },
  );

  // Join all individual error messages into a single string
  const combinedMessages = errors.map(e => e.message).join(', ');

  const statusCode = 400;
  return {
    statusCode,
    message: `Validation Error: ${combinedMessages}`,
    errorMessages: errors,
  };
};

export default handleValidationError;
