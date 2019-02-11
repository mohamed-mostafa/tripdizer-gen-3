import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'c-core-social',
	templateUrl: './social.component.html',
	styleUrls: ['./social.component.scss'],
})
export class SocialComponent implements OnInit {
	constructor() {}

	ngOnInit() {
		(function(d, s, id) {
			let js;
			const fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement(s);
			js.id = id;
			js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js#xfbml=1&version=v2.12&autoLogAppEvents=1';
			fjs.parentNode.insertBefore(js, fjs);
		})(document, 'script', 'facebook-jssdk');
	}
}
