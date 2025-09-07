import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginModel } from '../shared/models/account/login.model';
import { UserModel } from '../shared/models/account/user.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  apiUrl = environment.apiUrl;

  private http = inject(HttpClient);
  private route = inject(Router);

  constructor() {}

  login(model: LoginModel) {
    return this.http.post<UserModel>(this.apiUrl + 'account/login', model, {
      withCredentials: true,
    });
  }
}
