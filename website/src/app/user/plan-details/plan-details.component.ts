import { SideNavService } from './../side-nav.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'c-app-plan-details',
	templateUrl: './plan-details.component.html',
	styleUrls: ['./plan-details.component.scss'],
})
export class PlanDetailsComponent implements OnInit {
	constructor(public nav: SideNavService) {}

	ngOnInit() {}

	closeNav() {
		this.nav.closeNav();
	}
}
