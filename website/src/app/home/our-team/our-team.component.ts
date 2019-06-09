import { Component, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { OurTeamService } from './our-team.service';

@Component({
	selector: 'c-home-our-team',
	templateUrl: './our-team.component.html',
	styleUrls: ['./our-team.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class OurTeamComponent {
	teamMembers: Array<any> = [];
	options: any;
	refreshCarousel = new Subject();

	constructor(service: OurTeamService, public sanitizer: DomSanitizer, translate: TranslateService) {
		service.getTeamMembers().subscribe(teamMembers => {
			this.teamMembers = teamMembers;
			this.setOptions();
		});

		translate.onLangChange.subscribe(() => {
			service.getTeamMembers().subscribe(teamMembers => {
				this.teamMembers = teamMembers;
				if (this.options) {
					this.refreshCarousel.next();
				}
			});
		});
	}

	setOptions() {
		this.options = {
			center: true,
			loop: true,
			dots: true,
			autoWidth: true,
		};
	}
}
