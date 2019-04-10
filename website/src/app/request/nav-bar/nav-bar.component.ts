import { AfterViewInit, Component, HostListener } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/* Services */
import { MixpanelService } from '../../shared/services/mixpanel.service';
import { RequestService } from '../request.service';

/* Models */
import { Step } from '../step.model';

@Component({
	selector: 'c-request-nav-bar',
	templateUrl: './nav-bar.component.html',
	styleUrls: ['./nav-bar.component.scss'],
})
export class RequestNavBarComponent implements AfterViewInit {
	navBar: Array<Step>;
	currentPath: string;
	direction: string;

	@HostListener('window:resize', ['$event'])
	onResize() {
		this.setNavBrandWidth();
	}

	constructor(
		router: Router,
		translate: TranslateService,
		requestService: RequestService,
		private mixpanelService: MixpanelService
	) {
		this.navBar = requestService.getNavBar();
		requestService.requestNavBarDataChanged.subscribe(obj => {
			this.navBar = obj.navBar.sort((a, b) => a.order - b.order);
		});
		translate.get('dir').subscribe(dir => (this.direction = dir));
		router.events.subscribe(event => {
			if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
				this.currentPath = (event as NavigationEnd).urlAfterRedirects || event.url;
				const splittedUrl = this.currentPath.split('/');
				if (this.currentPath && splittedUrl) {
					this.currentPath = splittedUrl[splittedUrl.length - 1];
				}
				setTimeout(() => this.scrollIntoView(), 0);
			}
		});
	}

	ngAfterViewInit(): void {
		this.setNavBrandWidth();
	}

	setNavBrandWidth(): void {
		const componentHeight = document.getElementById('request-nav-bar-container').offsetHeight;
		(document.getElementsByClassName('nav-brand')[0] as HTMLElement).style.width = `${componentHeight}px`;
		(document.getElementsByClassName('nav-brand')[0] as HTMLElement).style.height = `${componentHeight}px`;
	}

	scrollIntoView(): void {
		const activeElements = document.getElementsByClassName('active');
		if (activeElements.length > 0) {
			activeElements[0].scrollIntoView({ inline: this.direction === 'rtl' ? 'end' : 'start' });
		}
	}

	onClick(step: Step): void {
		this.mixpanelService.track(`Navbar - ${step.title}`);
	}
}
