import http from 'http';
import app from './app';
import { env } from './config/env';
import { initSockets } from './sockets';
import { logger } from './utils/logger';

const server = http.createServer(app);

initSockets(server);

server.listen(env.port, () => {
  logger.info(`Nduthi Festival & Awards Kenya API running on port ${env.port} [${env.nodeEnv}]`);
  logger.info(`Health check: http://localhost:${env.port}/health`);
});

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});
