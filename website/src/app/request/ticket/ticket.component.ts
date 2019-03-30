import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctions } from 'src/app/shared/utils';

/* Services */
import { RequestService } from '../request.service';

/* Models */
import { Ticket } from './ticket.model';

@Component({
	selector: 'c-request-ticket',
	templateUrl: './ticket.component.html',
	styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent {
	currentStepPath: string;
	ticket: Ticket;
	invalidForSVG = false;
	isSentByMail = false;

	constructor(route: ActivatedRoute, router: Router, private requestService: RequestService) {
		this.currentStepPath = route.routeConfig.path;
		if (CommonFunctions.getOSName() === 'MacOS' || CommonFunctions.getBrowserInfo().name === 'Safari') {
			this.invalidForSVG = true;
		}
		requestService.submitRequest().subscribe((response: Ticket | null) => {
			if (response) {
				this.ticket = response;
			} else {
				router.navigate(['../', this.requestService.getPrevInvalidStep(this.currentStepPath)], { relativeTo: route });
			}
		});
	}

	serializeSVG(elementId: string): string {
		return (
			'data:image/svg+xml;base64,' +
			window.btoa(
				unescape(encodeURIComponent(new XMLSerializer().serializeToString(document.getElementById(elementId))))
			)
		);
	}

	downloadPackage() {
		window.open(this.ticket.packageDownloadUrl, '_self');
	}

	viewPackage() {
		window.open(this.ticket.packageUrl, '_blank');
	}

	sendByMail() {
		this.isSentByMail = true;
		this.requestService.sendPackageByMail();
	}

	calculate = (val1, sign?: string, val2?: number) => {
		switch (sign) {
			case '-':
				return val1 - val2;
			case '+':
				return val1 + val2;
			case '*':
				return val1 * val2;
			case '/':
				return val1 / val2;
			default:
				return val1;
		}
	}
}
