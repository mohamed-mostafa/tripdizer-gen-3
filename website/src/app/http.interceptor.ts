import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
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
		if (request.url.includes('jsonbin')) {
			request.headers.set('secret-key', '$2a$10$BC6mS0g9gyDJykM3vkeyrO5ayJinqHo12GoAMUQSgmFx1jc0zs0vG');
			request = request.clone({
				url: `${request.url}`,
				setHeaders: {
					'Content-Type': 'application/json',
					'secret-key': '$2a$10$BC6mS0g9gyDJykM3vkeyrO5ayJinqHo12GoAMUQSgmFx1jc0zs0vG',
					'collection-id': '5d5dfc835f686f769defda1e',
					'private': 'true',
				}
			});

			return next.handle(request).pipe(
				catchError((error: HttpErrorResponse) => {
					let errMsg = 'Unknown Error!';
					if (error.status === 0) {
						// Server not running!
						errMsg = 'Failed to connect to the server!';
					} else if (error.status === 401) {
						// Unauthorized
						errMsg = 'Unauthorized request to the server!';
					} else {
						errMsg = error.error.message || error.statusText;
					}
					return throwError(errMsg);
				})
			);
		} else if (request.headers.has('localUrl')) {
			const headers = request.headers.delete('localUrl');
			return next.handle(request.clone({ headers }));
		} else {
			// Clone the request to add baseUri.
			request = request.clone({
				url: `${this.baseUri}${request.url}`,
				setParams: { lang: this.translate.currentLang },
			});

			// if (localStorage.getItem('token') ? true : false) {
			//     request = request.clone({ headers: request.headers.set('Authorization', localStorage.getItem('token')) });
			// }

			// Send the newly created request
			return next.handle(request).pipe(
				catchError((error: HttpErrorResponse) => {
					let errMsg = 'Unknown Error!';
					if (error.status === 0) {
						// Server not running!
						errMsg = 'Failed to connect to the server!';
					} else if (error.status === 401) {
						// Unauthorized
						errMsg = 'Unauthorized request to the server!';
					} else {
						errMsg = error.error.message || error.statusText;
					}
					return throwError(errMsg);
				})
			);
		}
	}
}
