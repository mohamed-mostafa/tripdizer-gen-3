import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SectionOurTeamService {
	private endPoint = 'public/team' /*+ (lang ? '?lang=' + lang : '')*/;
	private team: Array<any> = [
		{
			name: 'Ziad Eladawy',
			jobTitle: 'Founder, CEO',
			picture: 'https://static.tripdizer.com/Ziad_Eladawy_Founder_CEO.jpg',
		},
		{
			name: 'Yara Yehia',
			jobTitle: 'Cofounder, Managing Director',
			picture: 'https://static.tripdizer.com/Yara_Yehia_Cofounder_Managing_Director.jpg',
		},
		{
			name: 'Omama Saad',
			jobTitle: 'Operations Manager',
			picture: 'https://static.tripdizer.com/Omama_Saad_Operations_Manager.jpg',
		},
		{
			name: 'Fady Rasmy',
			jobTitle: 'Administration Manager',
			picture: 'https://static.tripdizer.com/Fady_Rasmy_Administration_Manager.jpg',
		},
		{
			name: 'Mariam Mahmoud',
			jobTitle: 'Travel Advisor',
			picture: 'https://static.tripdizer.com/Mariam_Mahmoud_Travel_Advisor.jpg',
		},
		{
			name: 'Abdullah Hassan',
			jobTitle: 'Travel Advisor',
			picture: 'https://static.tripdizer.com/Abdullah_Hassan_Travel_Advisor.jpg',
		},
		{
			name: 'Ahmed Essawy',
			jobTitle: 'Software Engineer',
			picture: 'https://static.tripdizer.com/Ahmed_Essawy_Software_Engineer.jpg',
		},
		{
			name: 'Asmaa Kamal',
			jobTitle: 'Travel Agent',
			picture: 'https://static.tripdizer.com/Asmaa_Kamal_Travel_Agent.jpg',
		},
		{
			name: 'Mina Emad',
			jobTitle: 'Graphic Designer',
			picture: 'https://static.tripdizer.com/Mina_Emad_Graphic_Designer.jpg',
		},
		{
			name: 'Mohamed Mostafa',
			jobTitle: 'Cofounder, CTO',
			picture: 'https://static.tripdizer.com/Mohamed_cofounder_CTO.jpg',
		},
		{
			name: 'Hatem Ayoub',
			jobTitle: 'Cofounder, CMO',
			picture: 'https://static.tripdizer.com/Hatem_Ayoub_Cofounder_CMO.jpg',
		},
	];

	constructor(private http: HttpClient) {}

	getTeamMembers(): Observable<Array<any>> {
		return of(this.team);
		// return this.http.get<Array<any>>(`${this.endPoint}s`);
	}
}
