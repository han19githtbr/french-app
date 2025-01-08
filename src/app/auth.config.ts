import { AuthConfig } from "angular-oauth2-oidc";

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  clientId: '499431285897-edp2e1316tgt4bsdk32t0chtkt1vpfrs.apps.googleusercontent.com',
  redirectUri: window.location.origin,
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
}
