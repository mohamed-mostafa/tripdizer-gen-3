import { Component, OnInit } from '@angular/core';
import { Request } from './request.model';

/* Services */
import { RequestService } from './request.service';

@Component({
  selector: 'c-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  request = new Request();

  constructor(private requestService: RequestService) {
    requestService.requestDataChanged.subscribe(obj => {
      this.request[obj.key] = obj.value;
    });
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
