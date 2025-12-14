import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService extends ConsoleLogger {
  private logDir = 'logs';
  private maxFileSize: number;
  private logLevel: string;

  constructor() {
    super();
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.maxFileSize = parseInt(process.env.LOG_FILE_MAX_SIZE || '1024', 10) * 1024; // в байтах

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['verbose', 'debug', 'log', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  private writeToFile(level: string, message: string, context?: string, trace?: string) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      context: context || this.context,
      message,
      ...(trace && { trace }),
    };

    const logLine = JSON.stringify(logEntry) + '\n';

    this.rotateAndWrite('combined.log', logLine);

    if (level === 'error') {
      this.rotateAndWrite('error.log', logLine);
    }
  }

  private rotateAndWrite(filename: string, content: string) {
    const filePath = path.join(this.logDir, filename);

    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size >= this.maxFileSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const rotatedPath = path.join(
          this.logDir,
          `${filename}.${timestamp}`,
        );
        fs.renameSync(filePath, rotatedPath);
      }
    }

  
    fs.appendFileSync(filePath, content);
  }

  log(message: string, context?: string) {
    if (this.shouldLog('log')) {
      super.log(message, context);
      this.writeToFile('log', message, context);
    }
  }

  error(message: string, trace?: string, context?: string) {
    if (this.shouldLog('error')) {
      super.error(message, trace, context);
      this.writeToFile('error', message, context, trace);
    }
  }

  warn(message: string, context?: string) {
    if (this.shouldLog('warn')) {
      super.warn(message, context);
      this.writeToFile('warn', message, context);
    }
  }

  debug(message: string, context?: string) {
    if (this.shouldLog('debug')) {
      super.debug(message, context);
      this.writeToFile('debug', message, context);
    }
  }

  verbose(message: string, context?: string) {
    if (this.shouldLog('verbose')) {
      super.verbose(message, context);
      this.writeToFile('verbose', message, context);
    }
  }

  logRequest(method: string, url: string, body?: any, query?: any) {
    const message = `Incoming request: ${method} ${url}`;
    const details = JSON.stringify({ body, query });
    this.log(`${message} | ${details}`, 'HTTP');
  }

  logResponse(method: string, url: string, statusCode: number) {
    const message = `Response: ${method} ${url} - ${statusCode}`;
    this.log(message, 'HTTP');
  }

  logError(error: Error, context?: string) {
    this.error(`Error: ${error.message}`, error.stack, context);
  }
}
