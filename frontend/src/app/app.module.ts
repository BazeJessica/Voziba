import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { App } from './app';
import { Home } from './home/home';
import { Nav } from './nav/nav';
import { CategoryComponent } from './category/category';
import { BusinessesComponent } from './businesses/businesses';
import { TestimoniesComponent } from './testimonies/testimonies';
import { AddWorkModalComponent } from './add-work-modal/add-work-modal';
import { BookingModalComponent } from './booking-modal/booking-modal';
import { WorkDetailModalComponent } from './work-detail-modal/work-detail-modal';
import { UserProfileComponent } from './user-profile/user-profile';
import { BusinessDashboardComponent } from './business-dashboard/business-dashboard';
import { AdminPortalComponent } from './admin-portal/admin-portal';
import { SignupComponent } from './signup/signup';
import { LoginComponent } from './login/login';
import { Footer } from './footer/footer';
import { AboutComponent } from './about/about';
import { ContactComponent } from './contact/contact';
import { BrowseHandiworksComponent } from './browse-handiworks/browse-handiworks';
import { CategoriesPageComponent } from './categories/categories';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    App,
    Home,
    Nav,
    CategoryComponent,
    BusinessesComponent,
    TestimoniesComponent,
    AddWorkModalComponent,
    BookingModalComponent,
    WorkDetailModalComponent,
    UserProfileComponent,
    BusinessDashboardComponent,
    AdminPortalComponent,
    SignupComponent,
    LoginComponent,
    Footer,
    AboutComponent,
    ContactComponent,
    BrowseHandiworksComponent,
    CategoriesPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    MatIconModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [App]
})
export class AppModule { }
