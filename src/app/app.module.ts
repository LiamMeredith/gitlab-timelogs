import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './services/auth/auth-interceptor.service';
import { AuthService } from './services/auth/auth.service';
import { map } from 'rxjs/operators';
import { GitlabService } from './services/gitlab/gitlab.service';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { SharedModule } from './modules/shared/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: loadCurrentUser,
      deps: [AuthService, HttpClient, GitlabService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function loadCurrentUser(
  auth: AuthService,
  http: HttpClient,
  gitlabService: GitlabService,
) {
  return () => {
    return gitlabService.getCurrentUser().pipe(
      map(user => auth.setCurrentUser(user)),
    ).toPromise();
  };
}
