import { Component } from '@angular/core';
import { MatDialog as Mat } from '@angular/material/dialog';

@Component({
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  authenticated = false;
  constructor(private dialog: Mat) {}

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  
  closeMenu() {
    this.menuOpen = false;
  }
}
