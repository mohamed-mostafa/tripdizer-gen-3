import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'c-shared-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
	@Input() isFooterHidden = false;
	menuItems: Array<string> = [
		//  'FAQ',
		//  'Careers',
		//  'Press Releases',
		//  'Privacy Policy'
	];

	constructor() {}

	ngOnInit() {}
}
