import { Component, Input } from '@angular/core';

@Component({
	selector: 'c-app-loading-gradient',
	templateUrl: './loading-gradient.component.html',
	styleUrls: ['./loading-gradient.component.scss'],
})
export class LoadingGradientComponent {
	@Input() loadingHeight: number;
	@Input() loadingWidth: number;
}
