import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctions } from 'src/app/shared/utils';

/* Components */
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

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
	dialogLabels: {
		description: string;
		buttonsLabel: { cancel: string };
	};

	constructor(
		route: ActivatedRoute,
		router: Router,
		private requestService: RequestService,
		private dialog: MatDialog,
		translate: TranslateService
	) {
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
		translate.get('request.ticket.dialog').subscribe(labels => (this.dialogLabels = labels));
	}

	serializeSVG(elementId: string): string {
		return (
			'data:image/svg+xml;base64,' +
			window.btoa(
				unescape(encodeURIComponent(new XMLSerializer().serializeToString(document.getElementById(elementId))))
			)
		);
	}

	sendByMail() {
		this.isSentByMail = true;
		this.requestService.sendPackageByMail();
		this.openDialog();
	}

	openDialog(): void {
		this.dialog.open(DialogComponent, {
			autoFocus: true,
			maxWidth: 400,
			data: {
				description: this.dialogLabels ? this.dialogLabels.description : '',
				inputs: [],
				buttonsLabel: {
					cancel: this.dialogLabels && this.dialogLabels.buttonsLabel ? this.dialogLabels.buttonsLabel.cancel : '',
				},
			},
		});
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
