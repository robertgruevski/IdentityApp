import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormInput } from '../../shared/components/form-input/form-input';
import { ValidationMessage } from '../../shared/components/errors/validation-message/validation-message';
import { QRCodeComponent } from 'angularx-qrcode';
import { CodeInput } from '../../shared/components/code-input/code-input';
import { QrCodeModel } from '../../shared/models/myProfile/mfa.model';
import { SharedService } from '../../shared/shared.service';
import { MyProfileService } from '../my-profile.service';

@Component({
  selector: 'app-mfa-setup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormInput,
    ValidationMessage,
    QRCodeComponent,
    CodeInput,
  ],
  templateUrl: './mfa-setup.html',
  styleUrl: './mfa-setup.scss',
})
export class MfaSetup implements OnInit {
  mfaEnabled: boolean | undefined;
  qrCode: QrCodeModel | undefined;
  form: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];
  completed = false;

  private formBuilder = inject(FormBuilder);
  private sharedService = inject(SharedService);
  private myProfileService = inject(MyProfileService);

  constructor() {}

  ngOnInit(): void {
    this.getStatus();
  }

  save() {
    
  }

  //#region Private Methods
  private getStatus() {
    this.myProfileService.mfaStatus().subscribe({
      next: (response: any) => {
        this.mfaEnabled = response.isEnabled;
        if (this.mfaEnabled == false) {
          this.myProfileService.getQrCode().subscribe({
            next: (qrCode) => {
              this.qrCode = qrCode;
              this.completed = true;
            },
          });
        }
      },
    });
  }
  //#endregion
}
