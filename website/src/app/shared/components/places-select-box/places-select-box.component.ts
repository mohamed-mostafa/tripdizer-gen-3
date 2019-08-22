import { HomeService } from './../../../home/home.service';
import { CustomValidators } from './../../utils/custom.validators';
import { DialogComponent } from './../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Place } from '../../models/place.model';
import { Validators } from '@angular/forms';
@Component({
	selector: 'c-shared-places-select-box',
	templateUrl: './places-select-box.component.html',
	styleUrls: ['./places-select-box.component.scss'],
})
export class PlacesSelectBoxComponent implements OnInit {

	dialogLabels: {
		title: string;
		description: string;
		inputs: { input0: string, input1: string, input2: string, input3: string, };
		buttonsLabel: { ok: string; cancel: string };
	};


	separatorKeysCodes: number[] = [ENTER, COMMA];
	filteredPlaces: Observable<Array<Place>>;
	// filteredPlaces: BehaviorSubject<Array<Place>>;
	_selectedPlaces: Array<Place> = [];
	_places: Array<Place>;

	@Output() placesChanged = new EventEmitter<Array<Place>>();

	@Input() controlName = 'placeCtrl';
	@Input() formGroup = new FormGroup({ placeCtrl: new FormControl() });
	@Input() placeHolder;
	@Input() hidePlaceHolderConditionally = false;
	@Input() classes = '';
	@Input() property = 'id';
	@Input() set places(places: Array<Place>) {
		if (places) {
			places.push({ arName: 'أخرى', enName: 'Others', id: 0, name: 'Others', description: '' });
		}
		this._places = places || [];
		this.formGroup.get(this.controlName).setValue(null);
	}
	@Input() set selectedPlaces(places: Array<Place>) {
		if (places) {
			this._selectedPlaces = places;
		}

		console.log(this._places);
		console.log(this.places);
	}

	@ViewChild('placeInput') placeInput: ElementRef<HTMLInputElement>;

	get places(): Array<Place> {

		this._selectedPlaces.forEach(place => {
			if (place.id === 0) {
				this._places.splice(this._places.indexOf(place), 1);
			}
		});

		if (this._selectedPlaces.length === 3) {
			return [];
		}

		if (!this._selectedPlaces.length) {
			return this._places;
		}

		return this._places.filter(
			place => this._selectedPlaces.findIndex(p => p[this.property] === place[this.property]) < 0
		);
	}

	constructor(
		translate: TranslateService,
		public dialog: MatDialog,
		private homeService: HomeService
	) {
		translate.get('home.suggest_country_dialog').subscribe(labels => (this.dialogLabels = labels));
		translate
			.get('home.landing.destination_place_holder')
			.subscribe(placeHolder => (this.placeHolder = !this.placeHolder ? placeHolder : this.placeHolder));
	}

	ngOnInit() {
		this.filteredPlaces = this.formGroup.get(this.controlName).valueChanges.pipe(
			startWith(null),
			map((placeName: string | null) => (placeName ? this._filter(placeName) : this.places.slice()))
		);
	}

	addFromInput(event: MatChipInputEvent): void {
		if (event.input) {
			event.input.value = '';
		}

		this.formGroup.get(this.controlName).setValue(null);
		this.placeInput.nativeElement.blur();
	}

	addFromAutocomplete(event: MatAutocompleteSelectedEvent): void {
		const place = this._places.find(p => p[this.property] === event.option.value);

		if (place) {
			if (place.id !== 0) {
				this._selectedPlaces.push(place);
				this.formGroup.get(this.controlName).setValue(null);
				this.placesChanged.next(this._selectedPlaces);
				this.placeInput.nativeElement.value = '';
				this.placeInput.nativeElement.blur();
			} else {
				console.log('open modal');
				this.openDialog();
			}
		}
	}

	remove(property: string): void {
		const index = this._selectedPlaces.findIndex(p => p[this.property] === property);

		if (index >= 0) {
			this._selectedPlaces.splice(index, 1);
			this.formGroup.get(this.controlName).setValue(null);
		}
	}

	private _filter(value: string): Array<Place> {
		const filterValue = value.toString().toLowerCase();
		return this.places.filter(p => p.name.toLowerCase().indexOf(filterValue) === 0);
	}

	// openDialog(): void {
	// 	const dialogRef = this.dialog.open(SuggestCountryModalComponent, {
	// 		width: '450px',
	// 		data: 'hi'
	// 	});

	// 	dialogRef.afterClosed().subscribe(result => {
	// 		console.log('The dialog was closed', result);

	// 	});
	// }

	openDialog(): void {
		const dialogRef = this.dialog.open(DialogComponent, {
			autoFocus: true,
			maxWidth: 400,
			data: {
				title: this.dialogLabels ? this.dialogLabels.title : '',
				description: this.dialogLabels ? this.dialogLabels.description : '',
				inputs: [
					{
						id: 'fullName',
						value: null,
						placeHolder: this.dialogLabels && this.dialogLabels.inputs ? this.dialogLabels.inputs.input0 : '',
						validatorOrOpts: [Validators.required],
					},
					{
						id: 'phoneNumber',
						value: null,
						placeHolder: this.dialogLabels && this.dialogLabels.inputs ? this.dialogLabels.inputs.input1 : '',
						validatorOrOpts: [Validators.required, CustomValidators.numericOnly()],
					},
					{
						id: 'emailAddress',
						value: null,
						placeHolder: this.dialogLabels && this.dialogLabels.inputs ? this.dialogLabels.inputs.input2 : '',
						validatorOrOpts: [Validators.required],
					},
					{
						id: 'suggestedCountry',
						value: null,
						placeHolder: this.dialogLabels && this.dialogLabels.inputs ? this.dialogLabels.inputs.input3 : '',
						validatorOrOpts: [Validators.required],
					},
				],
				buttonsLabel: {
					ok: this.dialogLabels && this.dialogLabels.buttonsLabel ? this.dialogLabels.buttonsLabel.ok : '',
					cancel: this.dialogLabels && this.dialogLabels.buttonsLabel ? this.dialogLabels.buttonsLabel.cancel : '',
				},
			},
		});

		dialogRef.afterClosed().subscribe(inputs => {
			if (inputs && inputs[0]) {
				this.homeService.saveSuggestedCountry(inputs);
				console.log(inputs);
			}
		});
	}


}
