import { Component, OnInit } from '@angular/core';
import { Request } from './request.model';

@Component({
  selector: 'c-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  request = new Request();

  constructor() {
  }

  ngOnInit() {
    this.setDevHeights();
  }

  setDevHeights() {
    const navBarHeight = document.getElementById('nav-bar').offsetHeight;
    document.getElementById('body-container').style.height = `calc(100% - ${navBarHeight}px)`;
    document.getElementById('body-container').parentElement.style.height = '100%';
  }

}
