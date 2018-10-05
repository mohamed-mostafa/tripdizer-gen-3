import { Component, Input } from '@angular/core';

@Component({
  selector: 'c-home-section-why-us-nav-link',
  templateUrl: './nav-link.component.html',
  styleUrls: ['./nav-link.component.scss']
})
export class NavLinkComponent {

  @Input() type = 'v';

}
