import { AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms';

export class Dialog {
	title: string;
	description: string;
	inputs: Array<Input>;
	buttonsLabel: any;

	constructor() {
		this.inputs = [];
		this.buttonsLabel = {};
	}
}

class Input {
	id: string;
	type: 'text';
	value?: any;
	placeHolder: string;
	formState?: any;
	validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions;
	asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[];
}
