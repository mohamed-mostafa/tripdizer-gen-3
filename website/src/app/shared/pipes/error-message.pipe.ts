

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'errorMessage' })
export class ErrorMessagePipe implements PipeTransform {
    CUSTOM_ERROR_MESSAGES = {
        'required': 'Required',
        'validDate': 'Date format D / M / Y',
        'compareDates': 'Invalid dates',
        'email': 'Invalid email address',
        'numericOnly': 'Numeric only',
    };

    transform(obj: Object, separator: string = ', '): string {
        if (obj && obj instanceof Object) {
            return Object.keys(obj).map(key => typeof obj[key] === 'boolean' ? this.CUSTOM_ERROR_MESSAGES[key] : obj[key]).join(separator);
        }
        return '';
    }
}
