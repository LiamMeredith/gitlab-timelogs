import { Injectable } from '@angular/core';

/**
 * Service to set or get cookies
 */
@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }

  /**
   * Retrieve cookie
   */
  public getCookie(name: string) {
    const cookies: string[] = document.cookie.split(';');
    const cookieName = `${name}=`;
    return cookies.find((cookie) => cookie.includes(cookieName));
  }

  /**
   * Delete cookie
   */
  public deleteCookie(name) {
    this.setCookie(name, '', 0);
  }

  /**
   * Sets a cookie with a expireDays
   */
  public setCookie(name: string, value: string, expireDays: number, path: string = '') {
    const expireDate: Date = new Date();
    expireDate.setTime(expireDate.getTime() + expireDays * 24 * 60 * 60 * 1000);
    const expires: string = `expires=${expireDate.toUTCString()}`;
    const cpath: string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }
}
