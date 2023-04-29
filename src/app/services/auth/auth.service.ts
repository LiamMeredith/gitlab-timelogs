import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ConfigService } from '../config/config.service';
import { CookieService } from '../cookie/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private cookieName = 'gitLabAuth';
  private token: string;
  private currentUser: User;

  constructor(
    private cookieService: CookieService,
    ) {
    this.initAuth();
  }

  /**
   * Checks if there's a cookie with the auth token, if not, redirect to Auth page
   */
  private initAuth() {
    const foundCookie = this.cookieService.getCookie(this.cookieName);
    if (foundCookie) {
      this.token = foundCookie.split('=')[1];
    }
  }

  public setCurrentUser(user: User) {
    this.currentUser = user;
  }

  public getUsername(): string {
    return this.currentUser.username;
  }

  public getDisplayUsername(): string {
    return this.currentUser.displayName;
  }

  public getAvatarUrl(): string {
    return this.currentUser.avatarUrl;
  }

  public getCookieName(): string {
    return this.cookieName;
  }

  public getToken() {
    return this.token;
  }
}
