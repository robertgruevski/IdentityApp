import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { EditProfile } from './edit-profile/edit-profile';
import { ChangePassword } from './change-password/change-password';
import { DeleteAccount } from './delete-account/delete-account';
import { MfaSetup } from './mfa-setup/mfa-setup';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule, EditProfile, ChangePassword, DeleteAccount, MfaSetup, RouterLink],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.scss',
})
export class MyProfile implements OnInit {
  page: string = '';

  public accountService = inject(AccountService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const page = params.get('page');
      if (page) {
        const pageKeywords = ['edit-profile', 'change-password', 'delete-account', 'mfa-setup'];

        if (pageKeywords.some((pk) => page.includes(pk))) {
          this.page = page;
        } else {
          this.router.navigateByUrl('/my-profile/edit-profile');
        }
      } else {
        this.page = '/my-profile/edit-profile';
        this.router.navigateByUrl(this.page);
      }
    });
  }

  navigate(page: string) {
    this.page = page;
  }
}
