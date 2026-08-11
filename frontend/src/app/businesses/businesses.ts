import { Component, EventEmitter, Output, inject } from '@angular/core';
import { WorksService } from '../services/works.service';
import { workType } from '../models/types';

@Component({
  selector: 'app-businesses',
  standalone: false,
  templateUrl: './businesses.html',
  styleUrl: './businesses.scss'
})
export class BusinessesComponent {
  worksService = inject(WorksService);

  @Output() selectWorkToBook = new EventEmitter<workType>();
  @Output() selectWorkDetails = new EventEmitter<workType>();

  get filteredWorks() {
    return this.worksService.filteredWorks();
  }

  get selectedCategory() {
    return this.worksService.selectedCategory();
  }

  onBookNow(work: workType, event: Event) {
    event.stopPropagation();
    this.selectWorkToBook.emit(work);
  }

  onViewDetails(work: workType) {
    this.selectWorkDetails.emit(work);
  }
}
