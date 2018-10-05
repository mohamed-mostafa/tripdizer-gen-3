import { Component, OnInit } from '@angular/core';
import { SectionTestimonialService } from './section-testimonials.service';

@Component({
  selector: 'c-home-section-testimonials',
  templateUrl: './section-testimonials.component.html',
  styleUrls: ['./section-testimonials.component.scss']
})
export class SectionTestimonialsComponent implements OnInit {
  testimonials: Array<any> = [];
  sponsors: Array<any> = [];

  constructor(service: SectionTestimonialService) {

    service.getTestimonials().subscribe(testimonials => {
      this.testimonials = testimonials;
    });

    service.getSponsors().subscribe(sponsors => {
      this.sponsors = sponsors;
    });

  }

  ngOnInit() {
  }

}
