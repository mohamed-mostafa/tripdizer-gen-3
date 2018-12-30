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
  _resizeId;

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
    this.initOwlCarousel();
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
    clearTimeout(this._resizeId);
    this._resizeId = setTimeout(() => {
      if (this._options) {
        $(document).ready(() => {
          $(`#owl-carousel-container-${this._id}`).html($(`#owl-carousel-template-${this._id}`).html());
          $(`#owl-carousel-container-${this._id} .owl-carousel`).width(document.body.offsetWidth - 1).owlCarousel(this._options);
        });
      }
    }, 100);
  }

  ngOnDestroy() {
    this.refresh.unsubscribe();
  }
}
