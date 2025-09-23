import express, { Express } from 'express';
import AppError from './errors/app-error';
import globalErrorHandler from './middleware/global-error-handler';
const app: Express = express();

app.disable('x-powered-by');

//Root route
app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Welcome to our server!',
  });
});

app.get('/health', (_req, res) => {
  res.status(200).json({
    message: 'The server is running smoothly.',
  });
});

app.use((req, _res, next) => {
  next(new AppError(`Can't found ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

export default app;
