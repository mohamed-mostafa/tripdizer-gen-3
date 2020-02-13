import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class SideNavService {
	public navContent = new BehaviorSubject<any>(null);

	constructor() {}

	public openNav(page, data?) {
		this.navContent.next({ page, data });
	}

	closeNav() {
		this.navContent.next(null);
	}
}
