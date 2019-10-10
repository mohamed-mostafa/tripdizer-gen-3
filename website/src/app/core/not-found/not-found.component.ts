import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

declare const $: any;

@Component({
	selector: 'c-core-not-found',
	templateUrl: './not-found.component.html',
	styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
	path: string;

	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		this.route.data.pipe(take(1)).subscribe((data: { path: string }) => (this.path = data.path));

		$(document).ready(function() {
			$('.not-found').on('mousemove', this.parallax);
			$('.not-found').on('mouseleave', this.stopParallax);
		});
	}

	parallax = e => {
		const windowWidth = $(window).width();
		if (windowWidth < 768) {
			return;
		}
		const halfFieldWidth = $('.parallax').width() / 2;
		const halfFieldHeight = $('.parallax').height() / 2;
		const fieldPos = $('.parallax').offset();
		const x = e.pageX;
		const y = e.pageY - fieldPos.top;
		const newX = (x - halfFieldWidth) / 30;
		const newY = (y - halfFieldHeight) / 30;
		$('.parallax [class*="wave"]').each(function(index) {
			$(this).css({
				transition: '',
				transform: 'translate3d(' + index * newX + 'px,' + index * newY + 'px,0px)',
			});
		});
	}

	stopParallax = () => {
		$('.parallax [class*="wave"]').css({
			transform: 'translate(0px,0px)',
			transition: 'all .7s',
		});
		setTimeout(() => {
			$('.parallax [class*="wave"]').css('transition', '');
		}, 700);
	}
}
