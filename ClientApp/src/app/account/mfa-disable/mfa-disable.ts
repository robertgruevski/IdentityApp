import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CodeInput } from '../../shared/components/code-input/code-input';
import { AccountService } from '../account.service';
import { SharedService } from '../../shared/shared.service';
import { MfaDisableModel } from '../../shared/models/account/mfaDisabled.model';

@Component({
  selector: 'app-mfa-disable',
  imports: [CommonModule, RouterLink, CodeInput],
  templateUrl: './mfa-disable.html',
  styleUrl: './mfa-disable.scss',
})
export class MfaDisable {
  email: string | undefined;
  fullCode: string | undefined;

  private accountService = inject(AccountService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private sharedService = inject(SharedService);

  constructor() {
    if (this.accountService.$user()) {
      this.router.navigateByUrl('/');
    } else {
      this.activatedRoute.queryParamMap.subscribe({
        next: (params: any) => {
          const email = params.get('email');
          if (email) {
            this.email = email;
          } else {
            this.router.navigateByUrl('/account/login');
          }
        },
      });
    }
  }

  fullCodeReceive(code: string) {
    this.fullCode = code.replace(/ /g, '');
  }

  submit() {
    if (this.email && this.fullCode && this.fullCode.length == 6) {
      this.accountService.mfaDisable(new MfaDisableModel(this.fullCode, this.email)).subscribe({
        next: (response) => {
          this.sharedService.showNotification(response);
          this.router.navigateByUrl('/account/login');
        },
      });
    }
  }
}
