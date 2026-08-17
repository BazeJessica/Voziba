import { Component, Input, inject } from '@angular/core';
import { WorksService } from '../services/works.service';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.html',
  styleUrl: './category.scss'
})
export class CategoryComponent {
  worksService = inject(WorksService);

  @Input() limit: number = 6;

  get categories() {
    const list = this.worksService.categories();
    return this.limit ? list.slice(0, this.limit) : list;
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
