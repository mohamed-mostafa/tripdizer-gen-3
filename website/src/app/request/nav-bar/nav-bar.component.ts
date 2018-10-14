import { Component, EventEmitter, Input, Output } from '@angular/core';
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
    this.setNavLinksWidth();
    this.setNavBrandWidth();
  }

  @Output() navBarDimensionChanged = new EventEmitter();

  constructor(private router: Router) { }

  setNavLinksWidth() {
    let navLinksContainerWidth = 0;
    const navLinksContainer = (document.getElementsByClassName('nav-links')[0].firstChild as HTMLElement);
    for (let i = 0; i < navLinksContainer.children.length; ++i) {
      const navLinkElement = navLinksContainer.children[i] as HTMLElement;
      navLinksContainerWidth += navLinkElement.offsetWidth;
    }
    navLinksContainer.style.width = `${navLinksContainerWidth * 1.01}px`;
  }

  setNavBrandWidth() {
    const componentHeight = document.getElementById('request-nav-bar-container').offsetHeight;
    (document.getElementsByClassName('nav-brand')[0] as HTMLElement).style.width = `${componentHeight}px`;
    this.navBarDimensionChanged.emit();
  }

  isActive(path: string): boolean {
    this.scrollIntoView();
    return this.router.url.endsWith(path);
  }

  scrollIntoView(): void {
    const activeElements = document.getElementsByClassName('active');
    if (activeElements.length > 0) { activeElements[0].scrollIntoView({ inline: 'start' }); }
  }

}
