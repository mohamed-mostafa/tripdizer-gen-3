import { Component, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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

  constructor(public sanitizer: DomSanitizer,
    service: SectionOurTeamService) {
    service.getTeamMembers().subscribe(teamMembers => {
      this.teamMembers = teamMembers;
      this.initOwlCarousel();
    });
  }

  initOwlCarousel() {
    $(document).ready(function () {
      $('.our-team-carousel.owl-carousel').width(document.body.offsetWidth).owlCarousel({
        center: true,
        loop: true,
        dots: false,
        autoWidth: true
      });
    });
  }
}
