import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
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
	placeCtrl = new FormControl();
	separatorKeysCodes: number[] = [ENTER, COMMA];
	filteredPlaces: Observable<Array<Place>>;
	selectedPlaces: Array<Place> = [];
	_places: Array<Place>;

	@Output() placesChanged = new EventEmitter<Array<Place>>();

	@Input() placeHolder;
	@Input() classes = '';
	@Input() property = 'id';
	@Input() set places(places: Array<Place>) {
		this._places = places || [];
		this.placeCtrl.setValue(null);
	}

	get places(): Array<Place> {
		if (this.selectedPlaces.length === 3) {
			return [];
		}

		if (!this.selectedPlaces.length) {
			return this._places;
		}

		return this._places.filter(
			place => this.selectedPlaces.findIndex(p => p[this.property] === place[this.property]) < 0
		);
	}

	constructor(translate: TranslateService) {
		translate
			.get('home.landing.destination_place_holder')
			.subscribe(placeHolder => (this.placeHolder = !this.placeHolder ? placeHolder : this.placeHolder));
		this.filteredPlaces = this.placeCtrl.valueChanges.pipe(
			startWith(null),
			map((placeName: string | null) => (placeName ? this._filter(placeName) : this.places.slice()))
		);
	}

	add(event: MatAutocompleteSelectedEvent): void {
		const place = this._places.find(p => p[this.property] === event.option.value);

		if (place) {
			this.selectedPlaces.push(place);
			this.placeCtrl.setValue(null);
			this.placesChanged.next(this.selectedPlaces);
		}
	}

	remove(property: string): void {
		const index = this.selectedPlaces.findIndex(p => p[this.property] === property);

		if (index >= 0) {
			this.selectedPlaces.splice(index, 1);
			this.placeCtrl.setValue(null);
		}
	}

	private _filter(value: string): Array<Place> {
		const filterValue = value.toString().toLowerCase();

		return this.places.filter(p => p.name.toLowerCase().indexOf(filterValue) === 0);
	}
}
