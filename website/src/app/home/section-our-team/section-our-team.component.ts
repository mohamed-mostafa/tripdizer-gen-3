import { Component, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { SectionOurTeamService } from './section-our-team.service';

declare var $: any;

@Component({
  selector: 'c-home-section-our-team',
  templateUrl: './section-our-team.component.html',
  styleUrls: ['./section-our-team.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SectionOurTeamComponent {

  teamMembers: Array<any> = [];
  _isRTL = false;

  constructor(public sanitizer: DomSanitizer,
    translate: TranslateService,
    service: SectionOurTeamService) {
    translate.stream('dir').subscribe(dir => this._isRTL = dir === 'rtl');

    service.getTeamMembers().subscribe(teamMembers => {
      this.teamMembers = teamMembers;
      this.initOwlCarousel();
    });

    translate.onLangChange.subscribe(() => {
      service.getTeamMembers().subscribe(teamMembers => {
        this.teamMembers = teamMembers;
        this.initOwlCarousel();
      });
    });
  }

  initOwlCarousel() {
    $(document).ready(() => {
      $('#our-team-carousel-container').html($('#our-team-carousel-template').html());
      $('#our-team-carousel-container .our-team-carousel.owl-carousel').width(document.body.offsetWidth).owlCarousel({
        rtl: this._isRTL,
        center: true,
        loop: true,
        dots: false,
        autoWidth: true
      });
    });
  }
}
