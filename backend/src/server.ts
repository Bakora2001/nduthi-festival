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
  logger.info(`Database connected: Render PostgreSQL`);
  logger.info(`M-Pesa Provider: Kopo Kopo (Till: ${process.env.KOPOKOPO_TILL_NUMBER || '4681183'})`);
});

process.on('unhandledRejection', (reason: any) => {
  logger.error(`Unhandled Rejection: ${reason?.stack || reason}`);
});

process.on('uncaughtException', (err: Error) => {
  logger.error(`Uncaught Exception: ${err.stack || err.message}`);
});
