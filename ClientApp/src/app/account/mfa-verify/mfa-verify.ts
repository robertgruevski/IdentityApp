import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CodeInput } from '../../shared/components/code-input/code-input';
import { AccountService } from '../account.service';
import { MfaVerifyModel } from '../../shared/models/account/mfaVerify.model';

@Component({
  selector: 'app-mfa-verify',
  imports: [CommonModule, CodeInput, RouterLink],
  templateUrl: './mfa-verify.html',
  styleUrl: './mfa-verify.scss'
})
export class MfaVerify {
  mfaToken: string | undefined;
  fullCode: string | undefined;

  private accountService = inject(AccountService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.activatedRoute.queryParamMap.subscribe({
      next: (params: any) => {
        const mfaToken = params.get('mfaToken');
        if(mfaToken) {
          this.mfaToken = mfaToken;
        } else {
          this.router.navigateByUrl('/account/login');
        }
      }
    });
  }

  fullCodeReceive(code: string) {
    this.fullCode = code.replace(/ /g, '');
  }

  submit() {
    if(this.mfaToken && this.fullCode && this.fullCode.length == 6) {
      this.accountService.mfaVerify(new MfaVerifyModel(this.mfaToken, this.fullCode)).subscribe({
        next: _ => {
          this.router.navigateByUrl('/');
        }
      })
    }
  }
}
