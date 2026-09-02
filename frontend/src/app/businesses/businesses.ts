import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
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
  @Input() limit?: number;

  get filteredWorks() {
    const works = this.worksService.filteredWorks();
    return this.limit ? works.slice(0, this.limit) : works;
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
