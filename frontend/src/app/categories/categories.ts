import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { WorksService } from '../services/works.service';
import { categoryType } from '../models/types';

@Component({
  selector: 'app-categories-page',
  standalone: false,
  templateUrl: './categories.html',
  styleUrl: './categories.scss'
})
export class CategoriesPageComponent {
  worksService = inject(WorksService);
  router = inject(Router);

  searchQuery = signal<string>('');

  get categories(): categoryType[] {
    return this.worksService.categories();
  }

  filteredCategories = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.categories;
    return this.categories.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q)
    );
  });

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  selectCategoryAndBrowse(categoryName: string) {
    this.worksService.setCategory(categoryName);
    this.router.navigate(['/browse']);
  }
}
