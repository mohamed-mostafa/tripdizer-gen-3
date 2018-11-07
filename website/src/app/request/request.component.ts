import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'c-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RequestComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.setDevHeights();
  }

  setDevHeights() {
    const navBarHeight = document.getElementById('nav-bar').offsetHeight;
    document.getElementById('body-container').style.height = `calc(100% - ${navBarHeight}px)`;
    document.getElementById('body-container').style.marginTop = `${navBarHeight}px`;
    document.getElementById('body-container').parentElement.style.height = '100%';
  }

}
