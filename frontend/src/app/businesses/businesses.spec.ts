import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { BusinessesComponent } from './businesses';

describe('BusinessesComponent', () => {
  let component: BusinessesComponent;
  let fixture: ComponentFixture<BusinessesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
