import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable()
export class JWTokenInterceptor implements HttpInterceptor {
	private baseUri = environment.apiUrl;

	constructor(private translate: TranslateService) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (request.headers.has('localUrl')) {
			return next.handle(request);
		}
		const noBaseUrl = request.headers.has('noBaseUrl');

		const url = `${noBaseUrl ? '' : this.baseUri}${request.url}`;

		let headers = request.headers;
		headers = request.headers.delete('noBaseUrl');
		headers = headers.set('language', this.translate.currentLang);

		const credentials = localStorage.getItem('cred');
		if (!request.headers.has('Authorization') && !!credentials) {
			headers = request.headers.set('Authorization', `Bearer ${JSON.parse(credentials).token}`);
		}

		request = request.clone({
			url: url,
			headers: headers,
			setParams: { lang: this.translate.currentLang },
		});

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
