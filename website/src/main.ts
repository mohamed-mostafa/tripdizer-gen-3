import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { hmrBootstrap } from './hmr';

declare const module;

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if (environment.production) {
	enableProdMode();
	bootstrap().catch(err => console.error(err));
} else {
	if (module['hot']) {
		hmrBootstrap(module, bootstrap);
	} else {
		bootstrap().catch(err => console.error(err));
		console.error('HMR is not enabled for webpack-dev-server!');
		console.log('Are you using the --hmr flag for ng serve?');
	}
}

const scripts = {} as any;

// Global site tag (gtag.js) - Google Analytics
scripts.googleAnalyticsScriptP1 = document.createElement('script');
scripts.googleAnalyticsScriptP2 = document.createElement('script');
scripts.googleAnalyticsScriptP1.async = true;
scripts.googleAnalyticsScriptP1.src = `https://www.googletagmanager.com/gtag/js?${environment.google.analyticsTrackingID}`;
scripts.googleAnalyticsScriptP2.innerHTML = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${environment.google.analyticsTrackingID}');
gtag('config', '${environment.google.conversionTrackingId}');
`;

// Facebook Pixel Code
scripts.facebookPixelCodeP1 = document.createElement('script');
scripts.facebookPixelCodeP2 = document.createElement('noscript');
scripts.facebookPixelCodeP1.innerHTML = `
!function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${environment.facebook.pixelID}');
  fbq('track', 'PageView');
`;
scripts.facebookPixelCodeP2.innerHTML = `
<img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=${environment.facebook.pixelID}&ev=PageView&noscript=1"
/>
`;

for (const key in scripts) {
	if (scripts.hasOwnProperty(key)) {
		document.head.append(scripts[key]);
	}
}
