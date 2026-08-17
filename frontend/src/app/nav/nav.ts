import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-nav',
  standalone: false,
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  userService = inject(UserService);
  router = inject(Router);
  @Output() openListWorkModal = new EventEmitter<void>();
  menuOpen = false;

  user = this.userService.profile;
  isLoggedIn = this.userService.isLoggedIn;
  userRole = this.userService.userRole;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  onListWorkClick() {
    this.closeMenu();
    this.openListWorkModal.emit();
  }

  logout() {
    this.userService.logout();
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}
