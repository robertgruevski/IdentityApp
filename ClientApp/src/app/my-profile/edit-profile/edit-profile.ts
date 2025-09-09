import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationMessage } from '../../shared/components/errors/validation-message/validation-message';
import { FormInput } from '../../shared/components/form-input/form-input';
import { MyProfileModel } from '../../shared/models/myProfile/myProfile.model';
import { MyProfileService } from '../my-profile.service';
import { AccountService } from '../../account/account.service';
import { SharedService } from '../../shared/shared.service';
import { ApiResponse } from '../../shared/models/apiResponse.model';
import { UserModel } from '../../shared/models/account/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, ReactiveFormsModule, ValidationMessage, FormInput],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss',
})
export class EditProfile implements OnInit {
  myProfile: MyProfileModel | undefined;
  form: FormGroup = new FormGroup({});
  submitted = false;
  editMode = false;
  errorMessages: string[] = [];

  private formBuilder = inject(FormBuilder);
  private myProfileService = inject(MyProfileService);
  private accountService = inject(AccountService);
  private sharedService = inject(SharedService);
  private router = inject(Router);

  ngOnInit(): void {
    this.getMyProfile();
  }

  initializeForm() {
    if (this.myProfile) {
      this.form = this.formBuilder.group({
        name: [
          { value: this.myProfile.name, disabled: true },
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(15),
            Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*$'),
          ],
        ],
        email: [
          { value: this.myProfile.email, disabled: true },
          [Validators.required, Validators.pattern('^.+@[^\\.].*\\.[a-z]{2,}$')],
        ],
        currentPassword: [{ value: '', disabled: true }, [Validators.required]],
      });
    }
  }

  edit() {
    this.editMode = true;
    this.form.controls['name'].enable();
    this.form.controls['email'].enable();
    this.form.controls['currentPassword'].enable();
  }

  cancel() {
    this.editMode = false;
    this.submitted = false;
    this.errorMessages = [];

    this.initializeForm();
    this.form.markAsPristine();
  }

  save() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.form.valid && this.myProfile) {
      console.log(this.form.get('email'));
      const isEmailChanged =
        this.myProfile.email !== this.form.get('email')?.value.trim().toLowerCase();
      if (isEmailChanged) {
        this.sharedService
          .confirmBox(
            'You have updated your email address. If you save, you will be logged out and must confirm your new email before signing in again. Would you like to continue?'
          )
          .subscribe((result: boolean) => {
            if (result) {
              // the user has clicked Yes
              this.proceedSaving(isEmailChanged);
            }
          });
      } else {
        this.proceedSaving(isEmailChanged);
      }
    }
  }

  //#region Private Methods
  private proceedSaving(isEmailChanged: boolean) {
    this.myProfileService.editMyProfile(this.form.value).subscribe({
      next: (response: ApiResponse<UserModel>) => {
        if (isEmailChanged) {
          this.sharedService.showNotification(response);
          this.accountService.setUser(null);
          this.router.navigateByUrl(
            '/account/confirm-email?email=' + this.form.controls['email'].value
          );
        } else {
          this.sharedService.showNotification(response);
          this.accountService.setUser(response.data);
          this.getMyProfile();
          this.cancel();
        }
      },
      error: (error) => {
        if (error) {
          if (error.errors) {
            this.errorMessages = error.errors;
          }
        }
      },
    });
  }

  private getMyProfile() {
    this.myProfileService.getMyProfile().subscribe({
      next: (response) => {
        this.myProfile = response;
        this.initializeForm();
      },
    });
  }
  //#endregion
}
