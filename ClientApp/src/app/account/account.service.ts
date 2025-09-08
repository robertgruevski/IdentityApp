import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginModel } from '../shared/models/account/login.model';
import { AuthStatusModel, UserModel } from '../shared/models/account/user.model';
import { map } from 'rxjs';
import { RegisterModel } from '../shared/models/account/register.model';
import { ApiResponse } from '../shared/models/apiResponse.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  apiUrl = environment.apiUrl;
  $user = signal<UserModel | null>(null);

  private http = inject(HttpClient);
  private route = inject(Router);

  constructor() {}

  authStatus() {
    return this.http.get<AuthStatusModel>(this.apiUrl + 'account/auth-status');
  }

  refreshUser() {
    return this.http.get<UserModel>(this.apiUrl + 'account/refresh-appuser').pipe(
      map((user: UserModel) => {
        if (user) {
          this.setUser(user);
        }
      })
    );
  }

  login(model: LoginModel) {
    return this.http.post<UserModel>(this.apiUrl + 'account/login', model).pipe(
      map((user: UserModel) => {
        if (user) {
          this.setUser(user);
        }
      })
    );
  }
  
  register(model: RegisterModel) {
    return this.http.post<ApiResponse<any>>(environment.apiUrl + 'account/register', model);
  }

  checkNameTaken(name: string) {
    return this.http.get(environment.apiUrl + 'account/name-taken?name=' + name);
  }

  checkEmailTaken(email: string) {
    return this.http.get(environment.apiUrl + 'account/email-taken?email=' + email);
  }

  logout() {
    return this.http.post<{}>(this.apiUrl + 'account/logout', {}).pipe(
      map(() => {
        this.$user.set(null);
        this.route.navigateByUrl('/');
      })
    );
  }

  // #regin Private Methods
  private setUser(user: UserModel) {
    this.$user.set(user);
  }
  // #endregion
}
