import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Place } from '../../models/place.model';

@Component({
	selector: 'c-shared-places-select-box',
	templateUrl: './places-select-box.component.html',
	styleUrls: ['./places-select-box.component.scss'],
})
export class PlacesSelectBoxComponent {
	separatorKeysCodes: number[] = [ENTER, COMMA];
	filteredPlaces: Observable<Array<Place>>;
	_selectedPlaces: Array<Place> = [];
	_places: Array<Place>;

	@Output() placesChanged = new EventEmitter<Array<Place>>();

	@Input() formGroup = new FormGroup({ placeCtrl: new FormControl() });
	@Input() controlName = 'placeCtrl';
	@Input() placeHolder;
	@Input() hidePlaceHolderConditionally = false;
	@Input() classes = '';
	@Input() property = 'id';
	@Input() set places(places: Array<Place>) {
		this._places = places || [];
		this.formGroup.get(this.controlName).setValue(null);
	}
	@Input() set selectedPlaces(places: Array<Place>) {
		if (places) {
			this._selectedPlaces = places;
		}
	}

	@ViewChild('placeInput') placeInput: ElementRef<HTMLInputElement>;

	get places(): Array<Place> {
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

	constructor(translate: TranslateService) {
		translate
			.get('home.landing.destination_place_holder')
			.subscribe(placeHolder => (this.placeHolder = !this.placeHolder ? placeHolder : this.placeHolder));
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
			this._selectedPlaces.push(place);
			this.formGroup.get(this.controlName).setValue(null);
			this.placesChanged.next(this._selectedPlaces);
			this.placeInput.nativeElement.value = '';
			this.placeInput.nativeElement.blur();
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
}
