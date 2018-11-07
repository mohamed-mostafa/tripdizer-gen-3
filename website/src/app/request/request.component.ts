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
    document.getElementById('body-container').style.height = `${document.body.offsetHeight - navBarHeight}px`;
    document.getElementById('body-container').style.marginTop = `${navBarHeight}px`;
  }

}
