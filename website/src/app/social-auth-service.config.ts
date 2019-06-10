import { AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { environment } from '../environments/environment';

export function SocialAuthServiceConfig() {
	return new AuthServiceConfig([
		{
			id: GoogleLoginProvider.PROVIDER_ID,
			provider: new GoogleLoginProvider(environment.google.OAuthID),
		},
		{
			id: FacebookLoginProvider.PROVIDER_ID,
			provider: new FacebookLoginProvider(environment.facebook.appID),
		},
	]);
}
