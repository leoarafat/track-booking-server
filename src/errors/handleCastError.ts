import IGenericErrorMessage from '../interfaces/error';
import mongoose from 'mongoose';

export const handleCastError = (error: mongoose.Error.CastError) => {
  const errors: IGenericErrorMessage[] = [
    { path: error.path, message: 'Invalid Id' },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'CastError -> Please Provide Valid ObjectID',
    errorMessages: errors,
  };
};
