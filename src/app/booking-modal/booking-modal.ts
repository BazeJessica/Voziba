import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { WorksService } from '../services/works.service';
import { workType, bookingType } from '../models/types';

@Component({
  selector: 'app-booking-modal',
  standalone: false,
  templateUrl: './booking-modal.html',
  styleUrl: './booking-modal.scss'
})
export class BookingModalComponent {
  worksService = inject(WorksService);

  @Input({ required: true }) work!: workType;
  @Output() close = new EventEmitter<void>();
  @Output() bookingCreated = new EventEmitter<bookingType>();

  customerName = '';
  customerEmail = '';
  customerPhone = '';
  bookingDate = '';
  customNotes = '';
  confirmedBooking: bookingType | null = null;

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (!this.customerName || !this.customerEmail || !this.bookingDate) {
      alert('Please fill in your name, email, and preferred booking/order date.');
      return;
    }

    const created = this.worksService.createBooking({
      workId: this.work.id,
      workTitle: this.work.title,
      creatorName: this.work.creatorName,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
      bookingDate: this.bookingDate,
      customNotes: this.customNotes,
      totalPrice: this.work.price
    });

    this.confirmedBooking = created;
    this.bookingCreated.emit(created);
  }
}
