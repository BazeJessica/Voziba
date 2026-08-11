import { Component, EventEmitter, Output, inject } from '@angular/core';
import { WorksService } from '../services/works.service';
import { categoryType } from '../models/types';

@Component({
  selector: 'app-add-work-modal',
  standalone: false,
  templateUrl: './add-work-modal.html',
  styleUrl: './add-work-modal.scss'
})
export class AddWorkModalComponent {
  worksService = inject(WorksService);

  @Output() close = new EventEmitter<void>();
  @Output() workAdded = new EventEmitter<void>();

  title = '';
  creatorName = '';
  creatorAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
  category = 'Woodworking & Furniture';
  description = '';
  price: number | null = null;
  priceType: 'fixed' | 'starting' | 'hourly' = 'fixed';
  turnaround = '3 - 5 days';
  location = '';
  img = 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&q=80&w=800';
  tagsInput = '';

  get categories(): categoryType[] {
    return this.worksService.categories();
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (!this.title || !this.creatorName || !this.description || !this.price || !this.location) {
      alert('Please fill in all required fields.');
      return;
    }

    const tags = this.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    this.worksService.addWork({
      title: this.title,
      creatorName: this.creatorName,
      creatorAvatar: this.creatorAvatar,
      category: this.category,
      description: this.description,
      price: Number(this.price),
      priceType: this.priceType,
      turnaround: this.turnaround,
      location: this.location,
      img: this.img,
      tags: tags.length > 0 ? tags : ['Handcrafted', 'Custom Work']
    });

    this.workAdded.emit();
    this.onClose();
  }
}
