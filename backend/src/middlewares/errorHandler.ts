import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

// A simple error handler that sends a JSON response.
// More advanced implementation could include logging, error tracking services, etc.
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // For debugging purposes

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong on the server.';

  sendError(res, message, statusCode, err.stack);
};
