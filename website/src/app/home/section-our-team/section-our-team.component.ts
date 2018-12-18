import { Component, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { SectionOurTeamService } from './section-our-team.service';

@Component({
  selector: 'c-home-section-our-team',
  templateUrl: './section-our-team.component.html',
  styleUrls: ['./section-our-team.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SectionOurTeamComponent {

  teamMembers: Array<any> = [];
  options: any;
  refreshCarousel = new Subject();

  constructor(service: SectionOurTeamService, public sanitizer: DomSanitizer, translate: TranslateService) {
    service.getTeamMembers().subscribe(teamMembers => {
      this.teamMembers = teamMembers;
      if (this.options) { this.refreshCarousel.next(); }
    });

    translate.onLangChange.subscribe(() => {
      service.getTeamMembers().subscribe(teamMembers => {
        this.teamMembers = teamMembers;
        if (this.options) { this.refreshCarousel.next(); }
      });
    });

    this.options = {
      center: true,
      loop: true,
      dots: false,
      autoWidth: true
    };
  }
}
