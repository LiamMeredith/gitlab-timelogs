import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CookieService } from 'src/app/services/cookie/cookie.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  public cookieForm: string;
  constructor(
    private auth: AuthService,
    private cookieService: CookieService,
    private route: Router,
  ) { }

  ngOnInit(): void {
  }

  public saveCookie() {
    if(this.cookieForm) {
      this.cookieService.setCookie(
        this.auth.getCookieName(),
        this.cookieForm,
        100,
      );
      this.route.navigate(['hours']);
    }
  }
}
