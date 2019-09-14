import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'errorMessage' })
export class ErrorMessagePipe implements PipeTransform {
	errorMessages = {};

	constructor(translate: TranslateService) {
		translate.get('shared.error_messages').subscribe(errorMessages => (this.errorMessages = errorMessages));
	}

	transform(obj: Object, separator: string = ', '): string {
		if (obj && obj instanceof Object) {
			return Object.keys(obj)
				.map(key => (typeof obj[key] === 'string' ? obj[key] : this.errorMessages[key]))
				.filter((v, i, s) => s.indexOf(v) === i)
				.join(separator);
		}
		return '';
	}
}
