import { Component, EventEmitter, Output, Input, inject, OnInit } from '@angular/core';
import { WorksService } from '../services/works.service';
import { categoryType } from '../models/types';

@Component({
  selector: 'app-add-work-modal',
  standalone: false,
  templateUrl: './add-work-modal.html',
  styleUrl: './add-work-modal.scss'
})
export class AddWorkModalComponent implements OnInit {
  worksService = inject(WorksService);

  @Input() initialCreatorName?: string;
  @Input() initialCreatorAvatar?: string;
  @Input() initialLocation?: string;

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
  gallery: string[] = [];
  tagsInput = '';

  ngOnInit() {
    if (this.initialCreatorName) {
      this.creatorName = this.initialCreatorName;
    }
    if (this.initialCreatorAvatar) {
      this.creatorAvatar = this.initialCreatorAvatar;
    }
    if (this.initialLocation) {
      this.location = this.initialLocation;
    }
  }

  get categories(): categoryType[] {
    return this.worksService.categories();
  }

  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target?.result as string;
        if (base64Url) {
          this.img = base64Url;
          if (!this.gallery.includes(base64Url)) {
            this.gallery.unshift(base64Url);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onMultipleImagesUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files).slice(0, 5); // Allow up to 5 photos per item
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Url = e.target?.result as string;
          if (base64Url) {
            if (index === 0 && (!this.img || this.img.includes('unsplash'))) {
              this.img = base64Url;
            }
            if (this.gallery.length < 5 && !this.gallery.includes(base64Url)) {
              this.gallery.push(base64Url);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeGalleryImage(index: number) {
    this.gallery.splice(index, 1);
    if (this.gallery.length > 0) {
      this.img = this.gallery[0];
    }
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
      gallery: this.gallery.length > 0 ? this.gallery : [this.img],
      tags: tags.length > 0 ? tags : ['Handcrafted', 'Custom Work']
    });

    this.workAdded.emit();
    this.onClose();
  }
}
