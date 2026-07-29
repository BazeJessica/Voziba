import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nav',
  standalone: false,
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  @Output() openListWorkModal = new EventEmitter<void>();
  menuOpen = false;

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
}
