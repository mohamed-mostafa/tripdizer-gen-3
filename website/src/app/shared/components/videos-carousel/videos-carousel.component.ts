import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'tripdizer-c-videos-carousel',
  templateUrl: './videos-carousel.component.html',
  styleUrls: ['./videos-carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VideosCarouselComponent implements OnInit {

  _videos: Array<any> = [];

  get videos(): Array<any> {
    return this._videos;
  }

  @Input('videos') set videos(value: Array<any>) {
    if (Array.isArray(value) && value.length > 0) {
      this._videos = value;
      this.initOwlCarousel();
    }
  }

  constructor(public sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  initOwlCarousel() {
    $(document).ready(function () {
      const screenWidth = $('.videos-carousel.owl-carousel').width();
      const videoRatio = 560 / 315;
      $('.videos-carousel.owl-carousel').width(screenWidth).owlCarousel({
        items: 3,
        center: true,
        loop: true,
        autoWidth: true,
        nav: true,
        dots: false,
        responsive: {
          0: {
            videoWidth: screenWidth / 1.25,
            videoHeight: (screenWidth / 1.25) / videoRatio / 0.6
          },
          480: {
            videoWidth: screenWidth / 1.5,
            videoHeight: (screenWidth / 1.5) / videoRatio / 0.73
          },
          768: {
            videoWidth: screenWidth / 1.75,
            videoHeight: (screenWidth / 1.75) / videoRatio / 0.86
          },
          1200: {
            videoWidth: screenWidth / 2,
            videoHeight: (screenWidth / 2) / videoRatio / 0.99
          }
        }
      });
    });
  }
}
