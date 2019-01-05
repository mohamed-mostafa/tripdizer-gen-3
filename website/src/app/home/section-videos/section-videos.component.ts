import { Component, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

/* Services */
import { SectionVideosService } from './section-videos.service';

@Component({
  selector: 'c-home-section-videos',
  templateUrl: './section-videos.component.html',
  styleUrls: ['./section-videos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SectionVideosComponent {
  videos: Array<any> = [];
  options: any;
  refreshCarousel = new Subject();

  constructor(service: SectionVideosService, public sanitizer: DomSanitizer, translate: TranslateService) {
    service.getVideos().subscribe(videos => {
      this.videos = videos;
      this.setOptions();
    });

    translate.onLangChange.subscribe(() => {
      service.getVideos().subscribe(videos => {
        this.videos = videos;
        if (this.options) { this.refreshCarousel.next(); }
      });
    });
  }

  setOptions() {
    const screenWidth = document.body.offsetWidth;
    const videoRatio = 560 / 315;
    this.options = {
      items: 3,
      center: true,
      loop: true,
      autoWidth: true,
      nav: true,
      dots: false,
      responsive: {
        0: {
          videoWidth: screenWidth / 1.25,
          videoHeight: (screenWidth / 1.25) / videoRatio
        },
        480: {
          videoWidth: screenWidth / 1.5,
          videoHeight: (screenWidth / 1.5) / videoRatio
        },
        768: {
          videoWidth: screenWidth / 1.75,
          videoHeight: (screenWidth / 1.75) / videoRatio
        },
        1200: {
          videoWidth: screenWidth / 2,
          videoHeight: (screenWidth / 2) / videoRatio
        }
      }
    };
  }
}
