import { Component, inject } from '@angular/core';
import { WorksService } from '../services/works.service';

@Component({
  selector: 'app-testimonies',
  standalone: false,
  templateUrl: './testimonies.html',
  styleUrl: './testimonies.scss'
})
export class TestimoniesComponent {
  worksService = inject(WorksService);

  get testimonies() {
    return this.worksService.testimonies();
  }
}
