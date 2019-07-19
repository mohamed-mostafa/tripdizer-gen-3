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
	_selectedPlaces: Array<Place> = [];
	_places: Array<Place>;

	@Output() placesChanged = new EventEmitter<Array<Place>>();

	@Input() placeHolder;
	@Input() classes = '';
	@Input() property = 'id';
	@Input() set places(places: Array<Place>) {
		this._places = places || [];
		this.placeCtrl.setValue(null);
	}
	@Input() set selectedPlaces(places: Array<Place>) {
		if (places) {
			this._selectedPlaces = places;
		}
	}

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
		this.filteredPlaces = this.placeCtrl.valueChanges.pipe(
			startWith(null),
			map((placeName: string | null) => (placeName ? this._filter(placeName) : this.places.slice()))
		);
	}

	add(event: MatAutocompleteSelectedEvent): void {
		const place = this._places.find(p => p[this.property] === event.option.value);

		if (place) {
			this._selectedPlaces.push(place);
			this.placeCtrl.setValue(null);
			this.placesChanged.next(this._selectedPlaces);
		}
	}

	remove(property: string): void {
		const index = this._selectedPlaces.findIndex(p => p[this.property] === property);

		if (index >= 0) {
			this._selectedPlaces.splice(index, 1);
			this.placeCtrl.setValue(null);
		}
	}

	private _filter(value: string): Array<Place> {
		const filterValue = value.toString().toLowerCase();

		return this.places.filter(p => p.name.toLowerCase().indexOf(filterValue) === 0);
	}
}
