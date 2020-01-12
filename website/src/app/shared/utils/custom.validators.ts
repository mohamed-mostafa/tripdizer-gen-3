import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { isMoment } from 'moment';

export class CustomValidators {
	static dateValid(errorMessage?: string): ValidatorFn {
		return (c: AbstractControl): { [key: string]: boolean } | null => {
			const date = c.value;
			if (isMoment(date) && date.isValid()) {
				return null;
			}
			if (Object.prototype.toString.call(date) === '[object Date]' && isNaN(date.getTime())) {
				return null;
			}
			return { validDate: true };
		};
	}
	static dateGreaterThan(dateField1: string, dateField2: string, errorMessage?: string): ValidatorFn {
		return (fg: FormGroup): { [key: string]: boolean } | null => {
			const c1 = fg.controls[dateField1];
			const c2 = fg.controls[dateField2];
			if (!c1 || !c2) {
				return null;
			}
			const errorKey = 'compareDates';
			const error = {};
			const c1Date = c1.value;
			const c2Date = c2.value;
			let c1errors = c1.errors;
			let c2errors = c2.errors;
			error[errorKey] = errorMessage || true;
			if (c1Date !== null && c2Date !== null && c1Date >= c2Date) {
				c1.setErrors(c1errors ? { ...c1errors, ...error } : error);
				c2.setErrors(c2errors ? { ...c2errors, ...error } : error);
				return error;
			}
			if (c1errors && c1errors.constructor === Object) {
				delete c1errors[errorKey];
				if (Object.keys(c1errors).length === 0) {
					c1errors = null;
				}
			}
			if (c2errors && c2errors.constructor === Object) {
				delete c2errors[errorKey];
				if (Object.keys(c2errors).length === 0) {
					c2errors = null;
				}
			}
			c1.setErrors(c1errors);
			c2.setErrors(c2errors);
			return null;
		};
	}
	static numericOnly(errorMessage?: string): ValidatorFn {
		return (c: AbstractControl): { [key: string]: string | boolean } | null => {
			const text = c.value;
			if (!text || /^[\u0660-\u06690-9]*$/.test(text)) {
				return null;
			}
			return { numericOnly: errorMessage || true };
		};
	}
	static equalTo(controlName: string, errorMessage?: string): ValidatorFn {
		return (c: AbstractControl): { [key: string]: string | boolean } | null => {
			if (c.parent && c.parent.controls[controlName]) {
				if (c.value === c.parent.controls[controlName].value) {
					return null;
				}
				if (
					c.value &&
					c.parent.controls[controlName].value &&
					c.value.toLowerCase() === c.parent.controls[controlName].value.toLowerCase()
				) {
					return null;
					return { copyPaste: true };
				}
			}
			return { equalTo: errorMessage || true };
		};
	}
	static notEmpty(errorMessage?: string): ValidatorFn {
		return (c: AbstractControl): { [key: string]: string | boolean } | null => {
			const text = c.value;
			if (!text || /\S/.test(text)) {
				return null;
			}
			return { notEmpty: errorMessage || true };
		};
	}
	static conditionallyRequired(param: () => boolean, errorMessage?: string): ValidatorFn {
		return (): { [key: string]: boolean } | null => {
			return Boolean(param()) ? null : { required: true };
		};
	}

	static isEmail(errorMessage?: string): ValidatorFn {
		return (c: AbstractControl): { [key: string]: string | boolean } | null => {
			const text = c.value;
			if (!text || /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(text)) {
				return null;
			}
			return { email: errorMessage || true };
		};
	}
}
