import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SectionOurTeamService } from './section-our-team.service';

declare var $: any;

@Component({
  selector: 'tripdizer-c-section-our-team',
  templateUrl: './section-our-team.component.html',
  styleUrls: ['./section-our-team.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SectionOurTeamComponent implements OnInit {

  teamMembers: Array<any> = [];

  constructor(public sanitizer: DomSanitizer,
    service: SectionOurTeamService) {
    service.getTeamMembers().subscribe(teamMembers => {
      this.teamMembers = teamMembers;
      this.initOwlCarousel();
    });
  }

  ngOnInit() {
  }

  initOwlCarousel() {
    $(document).ready(function () {
      $('.our-team-carousel.owl-carousel').width(document.body.clientWidth).owlCarousel({
        items: 5,
        center: true,
        loop: true,
        autoWidth: true,
        dots: false
      });
    });
  }
}
