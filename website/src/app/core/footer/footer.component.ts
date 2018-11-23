import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'c-core-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  menuItems: Array<string> = [
    //  'FAQ',
    //  'Careers',
    //  'Press Releases',
    //  'Privacy Policy'
  ];

  constructor() { }

  ngOnInit() {
  }

}
