import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  collapsed = true;

  public accountService = inject(AccountService);

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  logout() {
    this.accountService.logout().subscribe();
  }
}
