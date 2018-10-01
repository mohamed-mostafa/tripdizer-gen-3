import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';


@Injectable()
export class JWTokenInterceptor implements HttpInterceptor {
    private baseUri = environment.apiUrl;

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request to add baseUri.
        request = request.clone({ url: `${this.baseUri}${request.url}` });

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
                location.reload(true);
            } else {
                errMsg = error.error.message || error.statusText;
            }
            return throwError(errMsg);
        }));
    }
}
