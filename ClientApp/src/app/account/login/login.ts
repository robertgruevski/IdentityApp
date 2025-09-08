import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationMessage } from '../../shared/components/errors/validation-message/validation-message';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ValidationMessage],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  form: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];
  returnUrl: string | null = null;

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private accountService = inject(AccountService);

  constructor() {
    if (this.accountService.$user()) {
      this.router.navigateByUrl('/');
    } else {
      this.activatedRoute.queryParamMap.subscribe({
        next: (params: any) => {
          if (params) {
            this.returnUrl = params.get('returnUrl');
          }
        },
      });
    }
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.form.valid) {
      this.accountService.login(this.form.value).subscribe({
        next: (response) => {
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigateByUrl('/');
          }
        },
        error: (error) => {
          if (error.error.errors) {
            this.errorMessages = error.error.errors;
          }
        },
      });
    }
  }
}
