import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class ContactComponent {
  form = {
    name: '',
    email: '',
    topic: 'General Inquiry',
    subject: '',
    message: ''
  };

  submitted = false;
  submitting = false;

  enquiryTopics = [
    'General Inquiry',
    'Order Status & Booking Help',
    'Custom Artisan Specs Request',
    'Artisan Onboarding & Studio Verification',
    'Partnerships & Media'
  ];

  departments = [
    {
      title: 'Customer Support',
      email: 'support@voziba.com',
      desc: 'Assistance with custom orders, bookings & buyer protection.',
      icon: 'support_agent'
    },
    {
      title: 'Artisan Partnerships',
      email: 'artisans@voziba.com',
      desc: 'Onboarding inquiries for craftsmen & workshop owners.',
      icon: 'storefront'
    },
    {
      title: 'Press & Media',
      email: 'press@voziba.com',
      desc: 'Interviews, brand assets & media inquiries.',
      icon: 'newspaper'
    }
  ];

  offices = [
    {
      city: 'San Francisco HQ',
      address: '742 Market Street, Suite 400',
      hours: 'Mon - Fri: 8:00 AM - 6:00 PM PST',
      icon: 'business'
    },
    {
      city: 'London Studio Hub',
      address: '14 Artisan Square, Covent Garden',
      hours: 'Mon - Fri: 9:00 AM - 5:00 PM GMT',
      icon: 'location_city'
    }
  ];

  contactChannels = [
    { icon: 'email', label: 'General Email', value: 'hello@voziba.com', href: 'mailto:hello@voziba.com' },
    { icon: 'phone_in_talk', label: 'Hotline', value: '+1 (800) 555-VOZIBA', href: 'tel:+18005558694' },
    { icon: 'schedule', label: 'Support SLA', value: '< 24 Hours Response Time', href: null }
  ];

  onSubmit() {
    if (!this.form.name || !this.form.email || !this.form.message) return;
    this.submitting = true;
    setTimeout(() => {
      this.submitted = true;
      this.submitting = false;
    }, 1000);
  }

  resetForm() {
    this.submitted = false;
    this.form = { name: '', email: '', topic: 'General Inquiry', subject: '', message: '' };
  }
}
