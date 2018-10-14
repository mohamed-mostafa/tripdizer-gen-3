import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import { isMoment } from 'moment';

export class DateValidators {
    static valid(): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const date = c.value;
            if (isMoment(date) && date.isValid()) { return null; }
            if (Object.prototype.toString.call(date) === '[object Date]' && isNaN(date.getTime())) { return null; }
            return { 'validDate': true };
        };
    }
    static greaterThan(dateField1: string, dateField2: string, errorMessage?: string): ValidatorFn {
        return (fg: FormGroup): { [key: string]: boolean } | null => {
            const c1 = fg.controls[dateField1], c2 = fg.controls[dateField2];
            if (!c1 || !c2) { return null; }
            const errorKey = 'compareDates', error = {},
                c1Date = c1.value, c2Date = c2.value;
            let c1errors = c1.errors, c2errors = c2.errors;
            error[errorKey] = errorMessage || true;
            if ((c1Date !== null && c2Date !== null) && c1Date > c2Date) {
                c1.setErrors(c1errors ? { ...c1errors, ...error } : error);
                c2.setErrors(c2errors ? { ...c2errors, ...error } : error);
                return error;
            }
            if (c1errors && c1errors.constructor === Object) {
                delete c1errors[errorKey];
                if (Object.keys(c1errors).length === 0) { c1errors = null; }
            }
            if (c2errors && c2errors.constructor === Object) {
                delete c2errors[errorKey];
                if (Object.keys(c2errors).length === 0) { c2errors = null; }
            }
            c1.setErrors(c1errors);
            c2.setErrors(c2errors);
            return null;
        };
    }
}
