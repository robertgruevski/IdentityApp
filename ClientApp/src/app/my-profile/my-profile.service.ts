import { inject, Injectable, model } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../shared/models/apiResponse.model';
import { MyProfileModel } from '../shared/models/myProfile/myProfile.model';
import { EditMyProfileModel } from '../shared/models/myProfile/editMyProfile.model';
import { ChangePasswordModel } from '../shared/models/myProfile/changePassword.model';
import { DeleteAccountModel } from '../shared/models/myProfile/deleteAccount.model';

@Injectable({
  providedIn: 'root',
})
export class MyProfileService {
  apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  constructor() {}

  getMyProfile() {
    return this.http.get<MyProfileModel>(this.apiUrl + 'myprofile');
  }

  editMyProfile(model: EditMyProfileModel) {
    return this.http.put<ApiResponse<any>>(this.apiUrl + 'myprofile', model);
  }

  changedPassword(model: ChangePasswordModel) {
    return this.http.put<ApiResponse<any>>(this.apiUrl + 'myprofile/change-password', model);
  }

  deleteAccount(model: DeleteAccountModel) {
    return this.http.delete<ApiResponse<any>>(this.apiUrl + 'myprofile/delete-account', {
      body: model,
    });
  }
}
