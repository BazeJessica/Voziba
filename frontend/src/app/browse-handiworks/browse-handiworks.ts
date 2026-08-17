import { Component, inject, signal, computed } from '@angular/core';
import { WorksService } from '../services/works.service';
import { workType } from '../models/types';

@Component({
  selector: 'app-browse-handiworks',
  standalone: false,
  templateUrl: './browse-handiworks.html',
  styleUrl: './browse-handiworks.scss'
})
export class BrowseHandiworksComponent {
  worksService = inject(WorksService);

  // Sorting Option
  selectedSort = signal<'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'title'>('recommended');

  // Modals state
  selectedWorkToBook: workType | null = null;
  selectedWorkDetails: workType | null = null;

  // Categories list derived from WorksService
  categories = computed(() => {
    const cats = this.worksService.categories().map(c => c.name);
    return ['All', ...cats];
  });

  // Filtered & Sorted Works Computation
  sortedWorks = computed(() => {
    let items = [...this.worksService.filteredWorks()];
    const sort = this.selectedSort();

    switch (sort) {
      case 'price-asc':
        return items.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return items.sort((a, b) => b.price - a.price);
      case 'rating':
        return items.sort((a, b) => b.rating - a.rating);
      case 'title':
        return items.sort((a, b) => a.title.localeCompare(b.title));
      case 'recommended':
      default:
        // Featured first, then highest rating
        return items.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }
  });

  selectCategory(category: string) {
    this.worksService.setCategory(category);
  }

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.worksService.setSearchQuery(val);
  }

  onSortChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value as any;
    this.selectedSort.set(val);
  }

  openBooking(work: workType, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
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

  resetFilters() {
    this.worksService.setCategory('All');
    this.worksService.setSearchQuery('');
    this.selectedSort.set('recommended');
  }
}
