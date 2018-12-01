import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RequestService } from '../request.service';

@Component({
  selector: 'c-request-form-layout',
  templateUrl: './form-layout.component.html',
  styleUrls: ['./form-layout.component.scss']
})
export class RequestFormLayoutComponent {
  nextStepPath: string;
  prevStepPath: string;

  @Input() formGroup = new FormGroup({});
  @Input() nextLabel;
  @Input() backLabel;
  @Input() isButtonsHidden = false;
  @Input() isNextDisabled = false;
  @Input() isBackHidden = false;
  @Input() marginTop = 0;

  @Output() next = new EventEmitter();
  @Output() back = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    translate: TranslateService,
    requestService: RequestService
  ) {
    const currentStepPath = route.routeConfig.path;
    requestService.redirectIfShouldBeRedirected(currentStepPath);
    translate.get('request.form_layout').subscribe(labels => {
      this.nextLabel = labels.next_label;
      this.backLabel = labels.back_label;
    });
    this.nextStepPath = requestService.getNextStep(currentStepPath);
    this.prevStepPath = requestService.getPrevStep(currentStepPath);
    requestService.stepVisited(currentStepPath);
  }

  goToPrevStep() {
    this.back.emit();
    this.router.navigate(['../', this.prevStepPath], { relativeTo: this.route });
  }

  goToNextStep() {
    this.next.emit();
    this.router.navigate(['../', this.nextStepPath], { relativeTo: this.route });
  }

}
