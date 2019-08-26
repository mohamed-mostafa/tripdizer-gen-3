import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
	selector: 'c-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnDestroy {
	dialogLabels: {
		title: string;
		description: string;
		inputs: { input0: string };
		buttonsLabel: { ok: string; cancel: string };
	};
	navBarHeight: number;
	navBarHeightSubject = new Subject<number>();

	constructor(
		router: Router,
		translate: TranslateService
	) {
		translate.get('home.dialog').subscribe(labels => (this.dialogLabels = labels));

		// setTimeout(() => {
		// 	this.openDialog();
		// }, 5000);

		router.events.subscribe(() => {
			this.resizeFirstElement();
		});

		this.navBarHeightSubject.subscribe(height => {
			this.navBarHeight = height;
			this.resizeFirstElement();
		});
	}

	resizeFirstElement() {
		setTimeout(() => {
			const firstElement = document.getElementsByTagName('section')[0];
			if (firstElement) {
				firstElement.style.height = document.body.clientHeight - this.navBarHeight + 'px';
			}
		}, 0);
	}

	ngOnDestroy() {
		this.navBarHeightSubject.unsubscribe();
	}
}
