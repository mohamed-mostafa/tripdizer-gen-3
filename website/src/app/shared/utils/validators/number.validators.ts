import { AbstractControl, ValidatorFn } from '@angular/forms';

export class NumberValidators {
    static numericOnly(): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const text = c.value;
            if (!text || /^[0-9]*$/.test(text)) { return null; }
            return { 'numericOnly': true };
        };
    }
}
