import { Component, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

/* Services */
import { SectionTestimonialService } from './section-testimonials.service';

@Component({
  selector: 'c-home-section-testimonials',
  templateUrl: './section-testimonials.component.html',
  styleUrls: ['./section-testimonials.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SectionTestimonialsComponent {
  testimonials: Array<any> = [];
  sponsors: Array<any> = [];
  options: any;
  refreshCarousel = new Subject();

  constructor(service: SectionTestimonialService, public sanitizer: DomSanitizer, translate: TranslateService) {
    service.getTestimonials().subscribe(testimonials => {
      this.testimonials = testimonials;
      if (this.options) { this.refreshCarousel.next(); }
    });

    translate.onLangChange.subscribe(() => {
      service.getTestimonials().subscribe(testimonials => {
        this.testimonials = testimonials;
        if (this.options) { this.refreshCarousel.next(); }
      });
    });

    service.getSponsors().subscribe(sponsors => {
      this.sponsors = sponsors;
    });

    this.options = {
      dots: false,
      responsive: {
        0: {
          items: 1,
          margin: 10
        },
        768: {
          items: 2,
          margin: 30
        },
        992: {
          items: 2,
          margin: 40
        }
      }
    };
  }

}
