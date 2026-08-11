import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { BookingModalComponent } from './booking-modal';

describe('BookingModalComponent', () => {
  let component: BookingModalComponent;
  let fixture: ComponentFixture<BookingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingModalComponent);
    component = fixture.componentInstance;
    component.work = {
      id: 1,
      title: 'Handcrafted Chair',
      creatorName: 'Elias & Co. Woodworks',
      creatorAvatar: '',
      category: 'Woodworking',
      description: 'Solid walnut chair',
      price: 450,
      priceType: 'fixed',
      turnaround: '2 weeks',
      rating: 4.9,
      reviewsCount: 12,
      location: 'San Francisco',
      img: '',
      tags: ['wood']
    };
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
