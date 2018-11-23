import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/* Services */
import { SectionVideosService } from './section-videos.service';

@Component({
  selector: 'c-home-section-videos',
  templateUrl: './section-videos.component.html',
  styleUrls: ['./section-videos.component.scss']
})
export class SectionVideosComponent {
  videos: Array<any> = [];

  constructor(service: SectionVideosService, translate: TranslateService) {
    service.getVideos().subscribe(videos => {
      this.videos = videos;
    });

    translate.onLangChange.subscribe(() => {
      service.getVideos().subscribe(videos => {
        this.videos = videos;
      });
    });
  }

}
