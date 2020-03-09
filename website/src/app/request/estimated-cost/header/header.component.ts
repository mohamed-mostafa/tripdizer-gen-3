import { AfterViewInit, Component, HostListener } from '@angular/core';
import { Moment } from 'moment';
import { EstimatedCostService } from '../estimated-cost.service';

@Component({
	selector: 'c-estimated-cost-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class EstimatedCostHeaderComponent implements AfterViewInit {
	numberOfNights = 0;
	selectedCountriesName: string;
	selectedCountryImage: string;
	departureDate: Moment;
	returnDate: Moment;

	constructor(service: EstimatedCostService) {
		this.numberOfNights = service.getNumberOfNights();
		const selectedCountries = [...service.getSelectedCountries()];
		this.selectedCountriesName = selectedCountries.map(c => c.name).join(' - ');
		const firstCountry = selectedCountries.shift();
		this.selectedCountryImage = firstCountry ? firstCountry.thumbnail : null;
		this.departureDate = service.getDepartureDate();
		this.returnDate = service.getReturnDate();
	}

	@HostListener('window:resize', ['$event'])
	onResize() {
		this.setHeaderMargin();
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.setHeaderMargin();
		}, 100);
	}

	setHeaderMargin() {
		const navHeight = (document.getElementsByClassName('nav-brand')[0] as HTMLElement).style.height;
		const header = document.getElementById('estimated-cost-header') as HTMLElement;
		const headerChild = header.firstChild as HTMLElement;

		header.style.marginTop = `-${navHeight}`;
		header.style.minHeight = navHeight;
		const headerMarginBottom = window.getComputedStyle(header).marginBottom;
		headerChild.style.marginTop = `calc((${navHeight} - ${headerMarginBottom}) / 2)`;
	}
}
