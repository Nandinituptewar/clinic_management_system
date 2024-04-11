import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import CustomError from './custom-error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor( private readonly httpAdapterHost: HttpAdapterHost ) { }
    private readonly logger: Logger = new Logger();
    catch ( exception: unknown, host: ArgumentsHost ): void {
        // In certain situations `httpAdapter` might not be available in the
        // constructor method, thus we should resolve it here.
        const { httpAdapter } = this.httpAdapterHost;
        let httpStatus = 500;
        let message = 'Internal server error';
        let exceptionResponse = null;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        if ( exception instanceof HttpException ) {
            httpStatus = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
            message = exception.message || message;
            exceptionResponse = exception.getResponse();

        } else if ( exception instanceof CustomError ) {
            httpStatus = exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
            message = exception.message || message;
            exceptionResponse = { ...exception.error && { error: exception.error } };
        } else {
            // Error Notifications
            httpStatus = exception?.[ 'statusCode' ] || HttpStatus.INTERNAL_SERVER_ERROR;
            message = exception?.[ 'message' ] || message;
            this.logger.error( 'UnhandledException', exception );
        }
        const responseBody = {
            ...{
                timestamp: new Date().toISOString(),
                statusCode: httpStatus,
                message
            },
            ...exceptionResponse
        };
        const { ip, method, originalUrl } = request;
        const userAgent = request.get( 'user-agent' ) || '';
        const tenantId = request.get( 'x-tenant-id' ) || '';

        this.logger.error( `[${ tenantId }]: ${ method } ${ originalUrl } --> ${ httpStatus } - ${ userAgent } ${ ip }: ${ JSON.stringify( exception ) }` );
        httpAdapter.reply( ctx.getResponse(), responseBody, httpStatus );
    }
}
