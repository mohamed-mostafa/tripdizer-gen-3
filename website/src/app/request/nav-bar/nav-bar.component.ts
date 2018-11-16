import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

/* Models */
import { Step } from '../step.model';

/* Services */
import { RequestService } from '../request.service';

@Component({
  selector: 'c-request-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class RequestNavBarComponent implements AfterViewInit {
  navBar: Array<Step>;
  currentPath: string;

  @Output() navBarDimensionChanged = new EventEmitter();

  constructor(
    private router: Router,
    requestService: RequestService) {
    this.navBar = requestService.getNavBar();
    requestService.requestNavBarDataChanged.subscribe(obj => {
      this.navBar = obj.navBar.sort((a, b) => a.order - b.order);
      setTimeout(() => {
        this.setNavLinksWidth();
        this.setNavBrandWidth();
      }, 0);
    });
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = event.urlAfterRedirects;
        const splittedUrl = this.currentPath.split('/');
        if (this.currentPath && splittedUrl) {
          this.currentPath = splittedUrl[splittedUrl.length - 1];
        }
        setTimeout(() => this.scrollIntoView(), 0);
      }
    });
  }

  ngAfterViewInit() {
    this.setNavLinksWidth();
    this.setNavBrandWidth();
  }

  setNavLinksWidth() {
    let navLinksContainerWidth = 0;
    const navLinksContainer = (document.getElementsByClassName('nav-links')[0].firstChild as HTMLElement);
    for (let i = 0; i < navLinksContainer.children.length; ++i) {
      const navLinkElement = navLinksContainer.children[i] as HTMLElement;
      navLinksContainerWidth += navLinkElement.offsetWidth;
    }
    navLinksContainer.style.width = `${navLinksContainerWidth + 1}px`;
  }

  setNavBrandWidth() {
    const componentHeight = document.getElementById('request-nav-bar-container').offsetHeight;
    (document.getElementsByClassName('nav-brand')[0] as HTMLElement).style.width = `${componentHeight}px`;
    this.navBarDimensionChanged.emit();
  }

  scrollIntoView(): void {
    const activeElements = document.getElementsByClassName('active');
    if (activeElements.length > 0) { activeElements[0].scrollIntoView({ inline: 'start' }); }
  }

}
