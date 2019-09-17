import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { OwlCarousel } from 'ngx-owl-carousel';

/* Services */
import { SectionTestimonialService } from './section-testimonials.service';

@Component({
	selector: 'c-home-section-testimonials',
	templateUrl: './section-testimonials.component.html',
	styleUrls: ['./section-testimonials.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class SectionTestimonialsComponent {

	@ViewChild('owlElement') owlElement: OwlCarousel;

	testimonials: Array<any> = [];
	sponsors: Array<any> = [];
	options: any;
	carousel: OwlCarousel;
	selectedSlide = 0;

	constructor(service: SectionTestimonialService, public sanitizer: DomSanitizer, translate: TranslateService) {
		service.getTestimonials().subscribe(testimonials => {
			this.testimonials = testimonials;
			this.setOptions();
		});

		translate.onLangChange.subscribe(() => {
			service.getTestimonials().subscribe(testimonials => {
				this.testimonials = testimonials;
			});
		});

	}

	setOptions() {
		this.options = {
			dots: false,
			nav: true,
			responsive: {
				0: {
					items: 1,
					margin: 10,
				},
				768: {
					items: 1,
					margin: 10,
				},
				992: {
					items: 1,
					margin: 10,
				},
			},
		};
	}

	goToSlide(i) {
		this.owlElement.to([i]);
		this.selectedSlide = this.owlElement.$owlChild.currentSlideIndex;
		console.log(this.owlElement.$owlChild.currentSlideIndex, i);
	}
}
