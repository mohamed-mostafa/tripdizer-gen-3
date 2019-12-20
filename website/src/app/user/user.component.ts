import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
	selector: 'c-app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
	@ViewChild('sidenav', { static: true }) sidenav: MatSidenav;

	constructor() {}

	ngOnInit() {}

	closeNav() {
		this.sidenav.close();
	}

	openNav() {
		this.sidenav.open();
	}
}
