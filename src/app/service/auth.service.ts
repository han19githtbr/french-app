import { Injectable } from "@angular/core";
import { OAuthService } from "angular-oauth2-oidc";
import { authConfig } from "../auth.config";
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root',
})

export class AuthService {
  userProfile: any;

  constructor(private oauthService: OAuthService, private router: Router) {
    this.configureSingleSignOn();
  }

  private configureSingleSignOn() {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.isLoggedIn) {
        this.router.navigate(['/home']);
      }
    });
  }

  /*login() {
    this.oauthService.initLoginFlow();
  }*/

  login(): Promise<void> {
    this.oauthService.initLoginFlow();
    return new Promise<void>((resolve, reject) => {
        this.oauthService.events.subscribe(event => {
            if (event.type === 'token_received') {
                resolve();
                this.router.navigate(['/home']);
            } else if (event.type === 'session_terminated') {
                reject();
            } else if (event.type === 'discovery_document_load_error'){
                reject();
            } else if (event.type === 'discovery_document_loaded'){
                resolve();
            }
        });
    });
  }

  logout() {
    this.oauthService.logOut();
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  get userInfo() {
    return this.oauthService.getIdentityClaims();
  }

}
