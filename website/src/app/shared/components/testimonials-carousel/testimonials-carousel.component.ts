import { Component, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
  selector: 'c-shared-testimonials-carousel',
  templateUrl: './testimonials-carousel.component.html',
  styleUrls: ['./testimonials-carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TestimonialsCarouselComponent {

  _testimonials: Array<any> = [];
  _isRTL = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.initOwlCarousel();
  }

  get testimonials(): Array<any> {
    return this._testimonials;
  }

  @Input('testimonials') set testimonials(value: Array<any>) {
    if (Array.isArray(value) && value.length > 0) {
      this._testimonials = value;
      this.initOwlCarousel();
    }
  }

  constructor(public sanitizer: DomSanitizer, translate: TranslateService) {
    translate.stream('dir').subscribe(dir => this._isRTL = dir === 'rtl');
  }

  initOwlCarousel() {
    $(document).ready(() => {
      $('#testimonials-carousel-container').html($('#testimonials-carousel-template').html());
      $('#testimonials-carousel-container .testimonials-carousel.owl-carousel').width(document.body.offsetWidth).owlCarousel({
        rtl: this._isRTL,
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
      });
    });
  }
}
