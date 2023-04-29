import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Timelog } from 'src/app/models/timelog.model';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { buildTimelogQuery, timelogsQuery } from './graph-queries.model';
@Injectable({
  providedIn: 'root'
})
export class GitlabService {

  constructor(private http: HttpClient) { }

  public getTimelogs(params): Observable<Timelog[]> {
    return this.http.post(environment.apiUrl + '/graphql', {
      query: buildTimelogQuery(params),
    }).pipe(
      map((response: any) =>
        response?.data?.timelogs?.nodes?.map(timelog => Timelog.createFromApi(timelog)),
      ),
    );
  }

  public getCurrentUser(): Observable<User> {
    return this.http.get(environment.apiUrl + '/v4/user').pipe(
      map(response => User.createFromApi(response))
    );
  }
}
