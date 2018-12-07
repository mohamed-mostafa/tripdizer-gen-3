import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable()
export class JWTokenInterceptor implements HttpInterceptor {
    private baseUri = environment.apiUrl;

    constructor(private translate: TranslateService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.headers.has('localUrl')) {
            const headers = request.headers.delete('localUrl');
            return next.handle(request.clone({ headers }));
        } else {
            // Clone the request to add baseUri.
            request = request.clone({
                url: `${this.baseUri}${request.url}`,
                setParams: { lang: this.translate.currentLang }
            });

            // if (localStorage.getItem('token') ? true : false) {
            //     request = request.clone({ headers: request.headers.set('Authorization', localStorage.getItem('token')) });
            // }

            // Send the newly created request
            return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
                let errMsg = 'Unknown Error!';
                if (error.status === 0) { // Server not running!
                    errMsg = 'Failed to connect to the server!';
                } else if (error.status === 401) { // Unauthorized
                    errMsg = 'Unauthorized request to the server!';
                } else {
                    errMsg = error.error.message || error.statusText;
                }
                return throwError(errMsg);
            }));
        }
    }
}
