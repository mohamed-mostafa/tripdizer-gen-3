import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

/* Models */
import { INavLink } from './nav-bar.model';

@Component({
  selector: 'c-request-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class RequestNavBarComponent {
  navLinks: Array<INavLink> = [];

  @Input() set data(navLinks: any) {
    this.navLinks = Object.keys(navLinks).map(key => ({
      key: key,
      title: navLinks[key].title,
      value: navLinks[key].value,
      path: navLinks[key].path,
      order: navLinks[key].order
    })).sort((a, b) => a.order - b.order);
    this.setNavBrandWidth();
  }

  @Output() navBarDimensionChanged = new EventEmitter();

  constructor(private router: Router) { }

  setNavBrandWidth() {
    const componentHeight = document.getElementById('request-nav-bar-container').offsetHeight;
    (document.getElementsByClassName('nav-brand')[0] as HTMLElement).style.width = `${componentHeight}px`;
    this.navBarDimensionChanged.emit();
  }

  isActive(path: string): boolean {
    return this.router.url.endsWith(path);
  }

}
