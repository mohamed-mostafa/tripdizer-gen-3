import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'c-core-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  langs: Array<string>;
  langLabels: any = {
    ar: 'عربي',
    en: 'English'
  };

  constructor(public translate: TranslateService) {
    this.langs = translate.langs.filter(lang => lang !== translate.currentLang);
    translate.onLangChange.subscribe(event => {
      this.langs = translate.langs.filter(lang => lang !== event.lang);
    });
  }

}
