export class Logger {
  static info(message: string, ...args: unknown[]) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[INFO] ${new Date().toISOString()}: ${message}`, ...args);
    }
  }

  static error(message: string, error?: any, ...args: unknown[]) {
    const timestamp = new Date().toISOString();
    if (error instanceof Error) {
      console.error(`[ERROR] ${timestamp}: ${message}`, error.message, error.stack, ...args);
    } else {
      console.error(`[ERROR] ${timestamp}: ${message}`, error, ...args);
    }
  }

  static warn(message: string, ...args: unknown[]) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, ...args);
    }
  }

  static debug(message: string, ...args: unknown[]) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, ...args);
    }
  }

  static request(ctx: any) {
    if (process.env.NODE_ENV === 'development') {
      const { method, url, status, responseTime } = ctx;
      console.log(`[REQUEST] ${new Date().toISOString()}: ${method} ${url} ${status} - ${responseTime}ms`);
    }
  }
}
