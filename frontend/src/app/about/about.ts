import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class AboutComponent {
  teamMembers = this.loadTeamMembers();
  openFaqIndex: number | null = 0;

  private loadTeamMembers() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('voziba_admin_team');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.filter((m: any) => m.status !== 'Inactive');
          }
        } catch (e) {
          console.error('Failed to parse admin team in About page', e);
        }
      }
    }
    return [
      {
        name: 'Amara Asante',
        role: 'Founder & CEO',
        bio: 'Visionary behind Voziba, passionate about connecting local artisans with global consumers.',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Kwame Boateng',
        role: 'Head of Artisan Relations',
        bio: 'Dedicated to supporting craftspeople in growing their studios and showcasing bespoke creations.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Nana Ama Ofori',
        role: 'Lead Product Designer',
        bio: 'Crafting intuitive digital experiences that make discovering and booking handiworks effortless.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
      }
    ];
  }

  platformStats = [
    { value: '500+', label: 'Verified Master Artisans', icon: 'verified_user' },
    { value: '12,500+', label: 'Handcrafted Works Delivered', icon: 'inventory_2' },
    { value: '4.9 ★', label: 'Average Satisfaction Score', icon: 'star' },
    { value: '98.5%', label: 'On-Time Order Completion', icon: 'local_shipping' }
  ];

  values = [
    { icon: 'handshake', title: 'Authenticity & Heritage', desc: 'Every creator on Voziba is a verified artisan dedicated to authentic handmade craft methods.' },
    { icon: 'diversity_3', title: 'Empowering Communities', desc: 'We champion local studio owners, providing digital tools to grow their independent craft businesses.' },
    { icon: 'verified', title: 'Uncompromising Quality', desc: 'We uphold strict standards ensuring every custom piece is durable, beautiful, and heirloom-quality.' },
    { icon: 'eco', title: 'Sustainable Craftsmanship', desc: 'We advocate for eco-conscious materials, zero mass-production waste, and sustainable sourcing.' }
  ];

  guarantees = [
    {
      icon: 'shield',
      title: 'Artisan Verification Guarantee',
      desc: 'All makers are vetted for skill, material authenticity, and ethical production practices.'
    },
    {
      icon: 'lock',
      title: 'Secure Buyer Protection',
      desc: 'Your payments and order milestone tracking are safeguarded until your creation arrives.'
    },
    {
      icon: 'published_with_changes',
      title: 'Custom Specs Assurance',
      desc: 'Makers share progress photos and specs so your custom work matches your vision.'
    }
  ];

  faqs = [
    {
      q: 'How does ordering a custom handiwork on Voziba work?',
      a: 'Browse through artisan listings or categories, select your desired piece or request custom specifications, select your preferred turnaround date, and submit your order request directly to the maker.'
    },
    {
      q: 'Are all makers on Voziba verified?',
      a: 'Yes! Our team manually reviews every artisan profile, studio location, and portfolio sample before they are published to our public marketplace.'
    },
    {
      q: 'Can I request custom dimensions or materials for furniture and fashion?',
      a: 'Absolutely. During booking, you can add custom specifications, dimensions, color preferences, or reference notes for the artisan to review.'
    },
    {
      q: 'How can an artisan or maker list their studio on Voziba?',
      a: 'Simply click "Join as Maker" or register a Business Account to create your studio profile and publish your handiwork listings immediately.'
    }
  ];

  toggleFaq(index: number) {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }
}
