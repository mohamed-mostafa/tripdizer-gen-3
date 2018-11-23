import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

declare const gtag: Function;

@Component({
  selector: 'c-root',
  template: `<span dir="{{ 'dir' | translate }}" [class.rtl]="('dir' | translate) === 'rtl'">
  <router-outlet></router-outlet><c-core-social></c-core-social>
</span>`
})
export class AppComponent {
  constructor(router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('event', 'screen_view', { screen_name: event.urlAfterRedirects });
      }
    });
  }
}
