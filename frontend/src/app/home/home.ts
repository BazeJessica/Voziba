import { Component, inject } from '@angular/core';
import { WorksService } from '../services/works.service';
import { workType } from '../models/types';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  worksService = inject(WorksService);

  searchQuery = '';
  showAddWorkModal = false;
  selectedWorkToBook: workType | null = null;
  selectedWorkDetails: workType | null = null;

  valueItems = [
    {
      icon: "🔍",
      title: "Handcrafted Quality",
      description: "Discover genuine artisans, woodworkers, tailors & creators with verified authentic portfolios."
    },
    {
      icon: "⭐",
      title: "Direct Custom Orders",
      description: "Order custom sizes, materials & personalized specifications directly with the maker."
    },
    {
      icon: "📅",
      title: "Seamless Booking",
      description: "Schedule consultations and book handcrafted items online with instant confirmation."
    },
    {
      icon: "🛡️",
      title: "Buyer Protection",
      description: "Secure booking payments and direct creator communication for total satisfaction."
    }
  ];

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.worksService.setSearchQuery(this.searchQuery);
  }

  onSearchSubmit() {
    this.worksService.setSearchQuery(this.searchQuery);
    const worksElement = document.getElementById('works');
    if (worksElement) {
      worksElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openAddWork() {
    this.showAddWorkModal = true;
  }

  closeAddWork() {
    this.showAddWorkModal = false;
  }

  openBooking(work: workType) {
    this.selectedWorkToBook = work;
  }

  closeBooking() {
    this.selectedWorkToBook = null;
  }

  openWorkDetails(work: workType) {
    this.selectedWorkDetails = work;
  }

  closeWorkDetails() {
    this.selectedWorkDetails = null;
  }

  handleBookFromDetails(work: workType) {
    this.selectedWorkDetails = null;
    this.selectedWorkToBook = work;
  }

  scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
