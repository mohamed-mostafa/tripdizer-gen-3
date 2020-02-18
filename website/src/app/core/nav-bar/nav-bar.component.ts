import { Router } from '@angular/router';
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
	selector: 'c-core-nav-bar',
	templateUrl: './nav-bar.component.html',
	styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
	langs: Array<string>;
	langLabels: any = {
		ar: 'عربي',
		en: 'English',
	};

	@Input() height = new Subject<number>();

	@ViewChild('navBar', { static: true }) navBar: ElementRef;

	@HostListener('window:resize', ['$event'])
	onResize() {
		this.height.next(this.navBar.nativeElement.offsetHeight);
	}

	constructor(public translate: TranslateService) {
		this.langs = translate.langs.filter(lang => lang !== translate.currentLang);
		translate.onLangChange.subscribe(event => {
			// window.location.reload();
			this.langs = translate.langs.filter(lang => lang !== event.lang);
		});
	}

	ngOnInit() {
		setTimeout(() => {
			this.onResize();
		}, 0);
	}
	scrollTop() {
		window.scroll(0, 0);
	}
}
