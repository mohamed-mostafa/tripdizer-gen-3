import { Component, OnInit } from '@angular/core';
import { SectionVideosService } from './section-videos.service';

@Component({
  selector: 'tripdizer-c-section-videos',
  templateUrl: './section-videos.component.html',
  styleUrls: ['./section-videos.component.scss']
})
export class SectionVideosComponent implements OnInit {
  videos: Array<any> = [];

  constructor(service: SectionVideosService) {
    service.getVideos().subscribe(videos => {
      this.videos = videos;
    });
  }

  ngOnInit() {
  }

}
