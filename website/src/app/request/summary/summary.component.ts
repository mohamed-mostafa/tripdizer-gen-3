import { Station } from './station.model';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SummaryService } from './summary.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {

  stations: Observable<Array<Station>>;

	constructor(service: SummaryService) {
		this.stations = service.getStations();
	}

}
