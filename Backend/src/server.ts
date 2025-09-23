import http from 'http';

import app from './app';
import { config } from './config/config';
import connectDB from './config/db';

const port = config.get('port');

const server = http.createServer(app);

const main = async () => {
  try {
    await connectDB();
    server.listen(port, () => {
      console.info(`Server is listening on port: ${port}`);
      console.log(`Go to main route: http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);

  server.close(() => {
    console.log('Server is closed due to unhandled rejection');
    process.exit(1);
  });
});

process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception thrown:', error);
  server.close(() => {
    console.log('Server is closed due to uncaught exception');
    process.exit(1);
  });
});
