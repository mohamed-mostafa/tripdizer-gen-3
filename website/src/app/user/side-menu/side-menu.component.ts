import { SideNavService } from './../side-nav.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'c-app-side-menu',
	templateUrl: './side-menu.component.html',
	styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
	constructor(public nav: SideNavService) {}

	ngOnInit() {}

	closeNav() {
		this.nav.closeNav();
	}
}
