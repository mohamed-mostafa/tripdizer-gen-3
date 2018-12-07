import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/* Services */
import { SectionTestimonialService } from './section-testimonials.service';

@Component({
  selector: 'c-home-section-testimonials',
  templateUrl: './section-testimonials.component.html',
  styleUrls: ['./section-testimonials.component.scss']
})
export class SectionTestimonialsComponent {
  testimonials: Array<any> = [];
  sponsors: Array<any> = [];

  constructor(service: SectionTestimonialService, translate: TranslateService) {
    service.getTestimonials().subscribe(testimonials => {
      this.testimonials = testimonials;
    });

    translate.onLangChange.subscribe(() => {
      service.getTestimonials().subscribe(testimonials => {
        this.testimonials = testimonials;
      });
    });

    service.getSponsors().subscribe(sponsors => {
      this.sponsors = sponsors;
    });
  }

}
