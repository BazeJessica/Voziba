import { Component, inject } from '@angular/core';
import { WorksService } from '../services/works.service';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.html',
  styleUrl: './category.scss'
})
export class CategoryComponent {
  worksService = inject(WorksService);

  get categories() {
    return this.worksService.categories();
  }

  get selectedCategory() {
    return this.worksService.selectedCategory();
  }

  selectCategory(categoryName: string) {
    if (this.selectedCategory === categoryName) {
      this.worksService.setCategory('All');
    } else {
      this.worksService.setCategory(categoryName);
    }
  }
}
