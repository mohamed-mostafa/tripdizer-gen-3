import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

declare var $: any;

@Component({
  selector: 'c-shared-owl-carousel',
  templateUrl: './owl-carousel.component.html',
  styleUrls: ['./owl-carousel.component.scss']
})
export class OwlCarouselComponent implements OnInit, OnDestroy {

  _id = Math.floor(Math.random() * 999999) + 100000;
  _options: any;
  _isRTL = false;

  @Input() refresh: Subject<void>;
  @Input() newClass: string;
  @Input('options') set options(value: any) {
    if (value) {
      this._options = value;
      this._options.rtl = this._isRTL;
      this.initOwlCarousel();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this._options) { this.initOwlCarousel(); }
  }

  constructor(translate: TranslateService) {
    translate.stream('dir').subscribe(dir => {
      this._isRTL = dir === 'rtl';
      if (this._options) { this.initOwlCarousel(); }
    });
  }

  ngOnInit() {
    this.refresh.subscribe(this.initOwlCarousel);
  }

  initOwlCarousel() {
    if (this._options) {
      $(document).ready(() => {
        $(`#owl-carousel-container-${this._id}`).html($(`#owl-carousel-template-${this._id}`).html());
        $(`#owl-carousel-container-${this._id} .owl-carousel`).width(document.body.offsetWidth).owlCarousel(this._options);
      });
    }
  }

  ngOnDestroy() {
    this.refresh.unsubscribe();
  }
}
