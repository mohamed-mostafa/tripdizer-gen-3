import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'c-request-form-layout',
  templateUrl: './form-layout.component.html',
  styleUrls: ['./form-layout.component.scss']
})
export class RequestFormLayoutComponent {

  @Input() formGroup = new FormGroup({});
  @Input() nextLabel;
  @Input() backLabel;
  @Input() isNextDisabled = false;
  @Input() isBackHidden = false;
  @Input() nextStepPath: string;
  @Input() prevStepPath: string;
  @Input() marginTop = 0;

  @Output() next = new EventEmitter();
  @Output() back = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    translate: TranslateService
  ) {
    translate.get('request.form_layout').subscribe(labels => {
      this.nextLabel = labels.next_label;
      this.backLabel = labels.back_label;
    });
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
