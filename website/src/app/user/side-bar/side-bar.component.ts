import { Component } from '@angular/core';

@Component({
	selector: 'c-user-side-bar',
	templateUrl: './side-bar.component.html',
	styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
	constructor() {
		console.log('init sideNav');
	}
}
