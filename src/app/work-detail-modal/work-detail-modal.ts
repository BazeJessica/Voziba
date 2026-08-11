import { Component, EventEmitter, Input, Output } from '@angular/core';
import { workType } from '../models/types';

@Component({
  selector: 'app-work-detail-modal',
  standalone: false,
  templateUrl: './work-detail-modal.html',
  styleUrl: './work-detail-modal.scss'
})
export class WorkDetailModalComponent {
  @Input({ required: true }) work!: workType;
  @Output() close = new EventEmitter<void>();
  @Output() bookNow = new EventEmitter<workType>();

  onClose() {
    this.close.emit();
  }

  onBook() {
    this.bookNow.emit(this.work);
  }
}
