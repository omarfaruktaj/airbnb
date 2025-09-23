import { ErrorRequestHandler, Request, Response } from 'express';
import AppError from '@/errors/app-error';
import APIResponse from '@/utils/api-response';
import { config } from '@/config/config';

const handleDevelopmentError = (
  err: AppError,
  _req: Request,
  res: Response
) => {
  return res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const handleProductionError = (err: AppError, _req: Request, res: Response) => {
  //* Trusted Error send message
  if (err.isOperational) {
    return res
      .status(err.statusCode)
      .json(
        new APIResponse(
          err.statusCode,
          err.message,
          null,
          null,
          null,
          err.errors || null
        )
      );
  }
  //! Untrusted error! Don't leap information

  return res
    .status(500)
    .json(
      new APIResponse(500, 'Something went wrong!', null, null, null, null)
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (config.get('nodeEnv') === 'development') {
    handleDevelopmentError(error, req, res);
  } else if (config.get('nodeEnv') === 'production') {
    const err = { ...error };
    err.status = error.status || 'error';
    err.statusCode = error.statusCode || 500;

    handleProductionError(err, req, res);
  }
};

export default globalErrorHandler;
