import { Component, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
  selector: 'c-shared-videos-carousel',
  templateUrl: './videos-carousel.component.html',
  styleUrls: ['./videos-carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VideosCarouselComponent {

  _videos: Array<any> = [];
  _isRTL = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.initOwlCarousel();
  }

  get videos(): Array<any> {
    return this._videos;
  }

  @Input('videos') set videos(value: Array<any>) {
    if (Array.isArray(value) && value.length > 0) {
      this._videos = value;
      this.initOwlCarousel();
    }
  }

  constructor(public sanitizer: DomSanitizer, translate: TranslateService) {
    translate.stream('dir').subscribe(dir => this._isRTL = dir === 'rtl');
  }

  initOwlCarousel() {
    $(document).ready(() => {
      const screenWidth = document.body.offsetWidth;
      const videoRatio = 560 / 315;
      $('#videos-carousel-container').html($('#videos-carousel-template').html());
      $('#videos-carousel-container .videos-carousel.owl-carousel').width(screenWidth).owlCarousel({
        rtl: this._isRTL,
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
