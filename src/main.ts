import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from './Logging/logging.service';
import { AllExceptionsFilter } from './Filters/http-exception.filter';
import { LoggingInterceptor } from './Logging/logging.interceptor';

(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = new LoggingService();
  app.useLogger(logger);

  logger.log('Application initializing...', 'Bootstrap');

  app.useGlobalFilters(new AllExceptionsFilter(logger));

  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  process.on('uncaughtException', (error: Error) => {
    logger.error(
      `Uncaught Exception: ${error.message}`,
      error.stack,
      'Process',
    );
    setTimeout(() => process.exit(1), 1000);
  });

  process.on('unhandledRejection', (reason: any) => {
    logger.error(
      `Unhandled Rejection: ${reason}`,
      reason?.stack,
      'Process',
    );
  });

  await app.listen(4000);
  logger.log('Application is running on http://localhost:4000', 'Bootstrap');
}

bootstrap();
