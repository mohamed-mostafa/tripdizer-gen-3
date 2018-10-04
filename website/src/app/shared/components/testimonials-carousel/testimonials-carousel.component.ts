
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'c-shared-testimonials-carousel',
  templateUrl: './testimonials-carousel.component.html',
  styleUrls: ['./testimonials-carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TestimonialsCarouselComponent implements OnInit {

  _testimonials: Array<any> = [];

  get testimonials(): Array<any> {
    return this._testimonials;
  }

  @Input('testimonials') set testimonials(value: Array<any>) {
    if (Array.isArray(value) && value.length > 0) {
      this._testimonials = value;
      this.initOwlCarousel();
    }
  }

  constructor(public sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  initOwlCarousel() {
    $(document).ready(function () {
      $('.testimonials-carousel.owl-carousel').width(document.body.clientWidth).owlCarousel({
        items: 2,
        dots: false
      });
    });
  }
}
