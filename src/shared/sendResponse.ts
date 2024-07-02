import { Response } from 'express';

type IApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: T | null;
  activationToken?: T | null; // Make activationToken optional by using T | null
};

const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    meta: data.meta || undefined, // Remove redundant null check
    data: data.data || null,
    activationToken: data.activationToken || null,
  };

  // If activationToken is null, remove it from the responseData object
  if (responseData.activationToken === null) {
    delete responseData.activationToken;
  }

  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
