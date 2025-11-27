import { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export const sendSuccess = <T>(res: Response, data: T, message = 'Success', statusCode = 200) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

export const sendError = (res: Response, message = 'An error occurred', statusCode = 500, error?: any) => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    error: error?.toString() || 'Internal Server Error',
  };
  res.status(statusCode).json(response);
};
