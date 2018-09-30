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

  @Input() videos: Array<any> = [];

  constructor(public sanitizer: DomSanitizer) {
    $(document).ready(function () {
      const screenWidth = $('.owl-carousel').width();
      const videoRatio = 560 / 315;
      $('.owl-carousel').width(screenWidth).owlCarousel({
        items: 3,
        center: true,
        autoWidth: true,
        startPosition: 1,
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

  ngOnInit() {
  }

}
