import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { throwError, catchError } from 'rxjs';
import { loggerWinston } from './logger-winston.config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const contextReq = context['args'][0];
    const contextRes = context['args'][1];

    const { method, url, params, query, body } = contextReq;
    const statusCode = contextRes.statusCode;
    const service = 'App_NestJS';

    const messageLog = `method: ${JSON.stringify(
      method,
    )}, url: ${JSON.stringify(
      url,
    )}, statusCode: ${statusCode}, params: ${JSON.stringify(
      params,
    )}, queryParams: ${JSON.stringify(query)}, body: ${JSON.stringify(
      body,
    )} service: ${JSON.stringify(service)}`;

    loggerWinston.log(messageLog);

    return next.handle().pipe(
      catchError((err) => {
        {
          const messageLogErr = `method: ${JSON.stringify(
            method,
          )}, url: ${JSON.stringify(url)}, statusCode: ${
            err.status
          }, message: ${JSON.stringify(err.message)}, params: ${JSON.stringify(
            params,
          )}, queryParams: ${JSON.stringify(query)}, body: ${JSON.stringify(
            body,
          )}, service: ${JSON.stringify(service)}`;

          loggerWinston.error(messageLogErr);

          return throwError(() => err);
        }
      }),
    );
  }
}
