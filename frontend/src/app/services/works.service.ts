import { Injectable, signal, computed } from '@angular/core';
import { workType, categoryType, bookingType, testimonyType, businessProfileType } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class WorksService {
  // Categories Signal
  readonly categories = signal<categoryType[]>([
    {
      id: 1,
      name: 'Woodworking & Furniture',
      description: 'Handcrafted wooden tables, chairs, cabinets & decor',
      icon: 'chair',  // or 'table_restaurant' or 'cabin'
      itemCount: 12
    },
    {
      id: 2,
      name: 'Bespoke Tailoring',
      description: 'Custom suits, dresses, outerwear & traditional attire',
      icon: 'content_cut',  // or 'scissors'
      itemCount: 8
    },
    {
      id: 3,
      name: 'Pottery & Ceramics',
      description: 'Hand-thrown mugs, dinnerware & decorative ceramics',
      icon: 'local_cafe',  // or 'coffee' or 'pottery' (if available)
      itemCount: 15
    },
    {
      id: 4,
      name: 'Leathercraft',
      description: 'Hand-stitched leather wallets, bags, belts & boots',
      icon: 'work',  // or 'luggage'
      itemCount: 10
    },
    {
      id: 5,
      name: 'Jewelry & Accessories',
      description: 'Handmade silver, gold, beaded & gemstone jewelry',
      icon: 'diamond',  // or 'jewelry' 
      itemCount: 14
    },
    {
      id: 6,
      name: 'Artwork & Murals',
      description: 'Custom paintings, canvas art & handcrafted wall murals',
      icon: 'palette',  // or 'brush'
      itemCount: 9
    },
    {
      id: 7,
      name: 'Metalwork & Sculptures',
      description: 'Wrought iron gates, metal art & custom forgings',
      icon: 'build',  // or 'construction'
      itemCount: 6
    },
    {
      id: 8,
      name: 'Home Decor & Lighting',
      description: 'Artisanal lamps, woven rugs & hand-carved ornaments',
      icon: 'home',  // or 'lightbulb'
      itemCount: 11
    }
  ]);

  // Initial Sample Handiworks
  private initialWorks: workType[] = [
    {
      id: 1,
      title: 'Hand-Carved Walnut Dining Table',
      creatorName: 'Elias & Co. Woodworks',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      category: 'Woodworking & Furniture',
      description: 'Solid live-edge American walnut dining table with hand-rubbed organic oil finish and custom matte black steel legs. Built to last generations.',
      price: 1250,
      priceType: 'starting',
      turnaround: '2 - 3 weeks',
      rating: 4.9,
      reviewsCount: 34,
      location: 'Portland, OR',
      img: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800',
      featured: true,
      tags: ['Walnut', 'Live Edge', 'Custom Dining Table', 'Handcrafted']
    },
    {
      id: 2,
      title: 'Hand-Stitched Full-Grain Leather Travel Duffel',
      creatorName: 'Aria Handcrafted Leather',
      creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      category: 'Leathercraft',
      description: 'Meticulously saddle-stitched by hand using vegetable-tanned Italian leather. Features solid brass hardware and reinforced straps.',
      price: 340,
      priceType: 'fixed',
      turnaround: '5 - 7 business days',
      rating: 5.0,
      reviewsCount: 52,
      location: 'Austin, TX',
      img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
      featured: true,
      tags: ['Leather', 'Saddle Stitch', 'Travel Bag', 'Custom Engraving']
    },
    {
      id: 3,
      title: 'Bespoke Custom Wool Suit & Blazer',
      creatorName: 'Master Tailor Marcus',
      creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      category: 'Bespoke Tailoring',
      description: 'Precision fitted custom suit made from premium Merino wool. Complete personalized measurement session, canvas lining, and hand-finished buttonholes.',
      price: 680,
      priceType: 'starting',
      turnaround: '10 - 14 days',
      rating: 4.8,
      reviewsCount: 29,
      location: 'Chicago, IL',
      img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
      featured: true,
      tags: ['Bespoke', 'Custom Suit', 'Tailored', 'Merino Wool']
    },
    {
      id: 4,
      title: 'Speckled Stoneware Dinnerware Set (16 Piece)',
      creatorName: 'Terra Cotta Ceramics Lab',
      creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      category: 'Pottery & Ceramics',
      description: 'Wheel-thrown stoneware glazed in ocean teal and warm matte cream. Dishwasher and microwave safe hand-crafted pottery set for 4.',
      price: 210,
      priceType: 'fixed',
      turnaround: '1 - 2 weeks',
      rating: 4.9,
      reviewsCount: 41,
      location: 'Seattle, WA',
      img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800',
      featured: true,
      tags: ['Pottery', 'Stoneware', 'Glazed Mugs', 'Dinner Set']
    },
    {
      id: 5,
      title: 'Handmade Sterling Silver & Opal Ring',
      creatorName: 'Luna & Sol Jewelry',
      creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      category: 'Jewelry & Accessories',
      description: 'Organic leaf band forged in 925 sterling silver featuring a natural Ethiopian fire opal centerpiece. Custom sized to order.',
      price: 145,
      priceType: 'fixed',
      turnaround: '3 - 5 days',
      rating: 5.0,
      reviewsCount: 68,
      location: 'Santa Fe, NM',
      img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
      featured: false,
      tags: ['Sterling Silver', 'Opal', 'Handmade Ring', 'Gemstone']
    },
    {
      id: 6,
      title: 'Custom Botanical Oil Painting on Linen Canvas',
      creatorName: 'Atelier Vivienne Art',
      creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      category: 'Artwork & Murals',
      description: 'Lush original oil painting commission tailored to your color scheme and dimensions. Hand-stretched natural linen canvas with oak floating frame.',
      price: 450,
      priceType: 'starting',
      turnaround: '2 weeks',
      rating: 4.9,
      reviewsCount: 18,
      location: 'Denver, CO',
      img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
      featured: false,
      tags: ['Oil Painting', 'Canvas Art', 'Botanical', 'Commission']
    },
    {
      id: 7,
      title: 'Forged Steel Fire Pit & Grill Grate',
      creatorName: 'Ironclad Metalworks',
      creatorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
      category: 'Metalwork & Sculptures',
      description: 'Heavy duty hand-forged steel outdoor fire pit with removable cooking grate and custom geometric laser-cut side patterns.',
      price: 520,
      priceType: 'fixed',
      turnaround: '1 - 2 weeks',
      rating: 4.8,
      reviewsCount: 22,
      location: 'Asheville, NC',
      img: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=800',
      featured: false,
      tags: ['Forged Steel', 'Fire Pit', 'Custom Grill', 'Metalwork']
    },
    {
      id: 8,
      title: 'Hand-Woven Natural Jute & Wool Floor Runner',
      creatorName: 'WeaveCraft Studio',
      creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      category: 'Home Decor & Lighting',
      description: 'Hand-loomed textured rug crafted from sustainable jute fibers and soft un-dyed wool. Durable, eco-friendly accent for hallways.',
      price: 185,
      priceType: 'fixed',
      turnaround: '4 - 6 days',
      rating: 4.7,
      reviewsCount: 15,
      location: 'Portland, ME',
      img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800',
      featured: false,
      tags: ['Woven Rug', 'Natural Jute', 'Home Decor', 'Artisanal']
    }
  ];

  // Testimonies Signal
  readonly testimonies = signal<testimonyType[]>([
    {
      id: 1,
      customerName: 'Sarah Jenkins',
      customerRole: 'Homeowner & Collector',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
      workTitle: 'Hand-Carved Walnut Dining Table',
      creatorName: 'Elias & Co. Woodworks',
      comment: 'The dining table Elias created for our home exceeded every expectation. The teak finish and live-edge craftsmanship are stunning! Booking through Voziba was seamless.',
      rating: 5
    },
    {
      id: 2,
      customerName: 'David Vance',
      customerRole: 'Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
      workTitle: 'Hand-Stitched Leather Duffel',
      creatorName: 'Aria Handcrafted Leather',
      comment: 'Outstanding quality and smell of real full-grain leather. Aria customized the dimensions for my travel gear. I receive compliments everywhere I go.',
      rating: 5
    },
    {
      id: 3,
      customerName: 'Elena Rostova',
      customerRole: 'Interior Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      workTitle: 'Speckled Stoneware Set',
      creatorName: 'Terra Cotta Ceramics Lab',
      comment: 'We ordered custom dinnerware for a restaurant project. The teal glaze matches our branding perfectly! Fast turnaround and exquisite pottery.',
      rating: 5
    }
  ]);

  // Reactive state
  readonly works = signal<workType[]>(this.loadInitialWorks());
  readonly selectedCategory = signal<string>('All');
  readonly searchQuery = signal<string>('');
  readonly bookings = signal<bookingType[]>(this.loadInitialBookings());

  // Filtered Works Computation
  readonly filteredWorks = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();

    return this.works().filter(work => {
      const matchesCategory = category === 'All' || work.category === category;
      const matchesQuery = !query ||
        work.title.toLowerCase().includes(query) ||
        work.creatorName.toLowerCase().includes(query) ||
        work.description.toLowerCase().includes(query) ||
        work.category.toLowerCase().includes(query) ||
        work.tags.some(tag => tag.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  });

  // Featured Works Computation
  readonly featuredWorks = computed(() => {
    return this.works().filter(w => w.featured);
  });

  private loadInitialWorks(): workType[] {
    const saved = localStorage.getItem('voziba_works');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved works', e);
      }
    }
    return this.initialWorks;
  }

  private loadInitialBookings(): bookingType[] {
    const saved = localStorage.getItem('voziba_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved bookings', e);
      }
    }
    return [
      {
        id: 'BK-78921',
        workId: 1,
        workTitle: 'Hand-Carved Walnut Dining Table',
        creatorName: 'Elias & Co. Woodworks',
        customerName: 'Jessica Miller',
        customerEmail: 'jessica.m@example.com',
        customerPhone: '+1 (555) 234-5678',
        bookingDate: '2026-08-20',
        customNotes: 'Please carve subtle live edge on long sides and apply dark walnut matte oil finish.',
        totalPrice: 1250,
        status: 'confirmed',
        createdAt: '2026-08-01T14:32:00Z'
      },
      {
        id: 'BK-88341',
        workId: 1,
        workTitle: 'Hand-Carved Walnut Dining Table',
        creatorName: 'Elias & Co. Woodworks',
        customerName: 'Marcus Vance',
        customerEmail: 'marcus.v@example.com',
        customerPhone: '+1 (555) 891-2345',
        bookingDate: '2026-08-15',
        customNotes: 'Custom dimensions 8ft x 3.5ft. Matte steel legs.',
        totalPrice: 1400,
        status: 'pending',
        createdAt: '2026-08-03T11:10:00Z'
      },
      {
        id: 'BK-64210',
        workId: 4,
        workTitle: 'Speckled Stoneware Dinnerware Set (16 Piece)',
        creatorName: 'Terra Cotta Ceramics Lab',
        customerName: 'Jessica Miller',
        customerEmail: 'jessica.m@example.com',
        customerPhone: '+1 (555) 234-5678',
        bookingDate: '2026-07-15',
        customNotes: 'Ocean teal glaze option with warm matte cream trim.',
        totalPrice: 210,
        status: 'completed',
        createdAt: '2026-07-10T10:15:00Z'
      },
      {
        id: 'BK-55291',
        workId: 4,
        workTitle: 'Speckled Stoneware Dinnerware Set (16 Piece)',
        creatorName: 'Terra Cotta Ceramics Lab',
        customerName: 'David Sterling',
        customerEmail: 'd.sterling@designhouse.com',
        customerPhone: '+1 (555) 432-8765',
        bookingDate: '2026-08-18',
        customNotes: 'Need 2 sets delivered to restaurant showroom in Seattle.',
        totalPrice: 420,
        status: 'confirmed',
        createdAt: '2026-08-02T16:45:00Z'
      },
      {
        id: 'BK-91845',
        workId: 3,
        workTitle: 'Bespoke Custom Wool Suit & Blazer',
        creatorName: 'Master Tailor Marcus',
        customerName: 'Jessica Miller',
        customerEmail: 'jessica.m@example.com',
        customerPhone: '+1 (555) 234-5678',
        bookingDate: '2026-08-28',
        customNotes: 'Consultation for measurement fitting. Charcoal grey wool fabric.',
        totalPrice: 680,
        status: 'pending',
        createdAt: '2026-08-04T09:20:00Z'
      },
      {
        id: 'BK-44120',
        workId: 2,
        workTitle: 'Hand-Stitched Full-Grain Leather Travel Duffel',
        creatorName: 'Aria Handcrafted Leather',
        customerName: 'Samantha Chen',
        customerEmail: 's.chen@creativeminds.io',
        customerPhone: '+1 (555) 765-4321',
        bookingDate: '2026-08-12',
        customNotes: 'Custom initials "S.C." embossed in gold foil on leather tag.',
        totalPrice: 340,
        status: 'pending',
        createdAt: '2026-08-02T08:15:00Z'
      },
      {
        id: 'BK-33981',
        workId: 2,
        workTitle: 'Hand-Stitched Full-Grain Leather Travel Duffel',
        creatorName: 'Aria Handcrafted Leather',
        customerName: 'Robert Vance',
        customerEmail: 'robert.v@architecture.org',
        customerPhone: '+1 (555) 987-6543',
        bookingDate: '2026-08-10',
        customNotes: 'Cognac brown leather option with brass hardware.',
        totalPrice: 340,
        status: 'confirmed',
        createdAt: '2026-07-29T13:40:00Z'
      }
    ];
  }

  private persistWorks(worksList: workType[]) {
    localStorage.setItem('voziba_works', JSON.stringify(worksList));
  }

  private persistBookings(bookingsList: bookingType[]) {
    localStorage.setItem('voziba_bookings', JSON.stringify(bookingsList));
  }

  // Public Actions
  setCategory(categoryName: string) {
    this.selectedCategory.set(categoryName);
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  addWork(newWork: Omit<workType, 'id' | 'rating' | 'reviewsCount'>): workType {
    const id = Date.now();
    const created: workType = {
      ...newWork,
      id,
      rating: 5.0,
      reviewsCount: 1,
      featured: true
    };
    const updated = [created, ...this.works()];
    this.works.set(updated);
    this.persistWorks(updated);
    return created;
  }

  createBooking(bookingData: Omit<bookingType, 'id' | 'createdAt' | 'status'>): bookingType {
    const booking: bookingType = {
      ...bookingData,
      id: 'BK-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const updated = [booking, ...this.bookings()];
    this.bookings.set(updated);
    this.persistBookings(updated);
    return booking;
  }

  cancelBooking(bookingId: string) {
    const updated = this.bookings().map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b);
    this.bookings.set(updated);
    this.persistBookings(updated);
  }

  updateBookingStatus(bookingId: string, status: bookingType['status']) {
    const updated = this.bookings().map(b => b.id === bookingId ? { ...b, status } : b);
    this.bookings.set(updated);
    this.persistBookings(updated);
  }

  // Business Profiles State
  readonly businessProfiles = signal<Record<string, businessProfileType>>(this.loadInitialProfiles());

  private loadInitialProfiles(): Record<string, businessProfileType> {
    const saved = localStorage.getItem('voziba_business_profiles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      'Elias & Co. Woodworks': {
        name: 'Elias & Co. Woodworks',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        category: 'Woodworking & Furniture',
        location: 'Portland, OR',
        bio: 'Family-owned artisan woodworking studio specializing in live-edge dining tables, custom cabinetry, and sustainably sourced hardwood furniture.',
        email: 'contact@eliaswoodworks.com',
        phone: '+1 (555) 381-9920',
        businessHours: 'Mon - Fri: 8:00 AM - 6:00 PM',
        establishedYear: '2018'
      },
      'Master Tailor Marcus': {
        name: 'Master Tailor Marcus',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        category: 'Bespoke Tailoring',
        location: 'Chicago, IL',
        bio: 'Master craftsman with over 15 years in bespoke suit tailoring, hand-stitched tuxedos, and luxury wool outerwear.',
        email: 'marcus@bespoketailor.com',
        phone: '+1 (555) 723-4411',
        businessHours: 'Tue - Sat: 10:00 AM - 7:00 PM',
        establishedYear: '2015'
      },
      'Terra Cotta Ceramics Lab': {
        name: 'Terra Cotta Ceramics Lab',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
        category: 'Pottery & Ceramics',
        location: 'Austin, TX',
        bio: 'Hand-thrown pottery studio crafting organic dinnerware, speckled ceramic mugs, and custom stoneware collections.',
        email: 'hello@terracottaceramics.com',
        phone: '+1 (555) 492-8833',
        businessHours: 'Mon - Sat: 9:00 AM - 5:00 PM',
        establishedYear: '2020'
      },
      'Aria Handcrafted Leather': {
        name: 'Aria Handcrafted Leather',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
        category: 'Leathercraft',
        location: 'Seattle, WA',
        bio: 'Hand-stitched vegetable-tanned leather goods built to last a lifetime. Custom bags, wallets, and equestrian leatherwork.',
        email: 'aria@leathertooling.com',
        phone: '+1 (555) 912-7744',
        businessHours: 'Mon - Fri: 9:00 AM - 5:00 PM',
        establishedYear: '2019'
      }
    };
  }

  private persistProfiles(profiles: Record<string, businessProfileType>) {
    localStorage.setItem('voziba_business_profiles', JSON.stringify(profiles));
  }

  getBusinessProfile(creatorName: string): businessProfileType {
    const profiles = this.businessProfiles();
    if (profiles[creatorName]) {
      return profiles[creatorName];
    }
    // Fallback default
    return {
      name: creatorName,
      avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
      category: 'Artisans & Craftsmen',
      location: 'Voziba Marketplace Network',
      bio: 'Professional artisan craftsman on Voziba marketplace offering custom handiworks and bespoke items.',
      email: 'contact@voziba.com',
      phone: '+1 (555) 000-0000',
      businessHours: 'Mon - Fri: 9:00 AM - 5:00 PM',
      establishedYear: '2022'
    };
  }

  updateBusinessProfile(oldName: string, updated: businessProfileType) {
    const currentProfiles = { ...this.businessProfiles() };
    if (oldName !== updated.name) {
      delete currentProfiles[oldName];
    }
    currentProfiles[updated.name] = updated;
    this.businessProfiles.set(currentProfiles);
    this.persistProfiles(currentProfiles);

    // Update works creator info
    const updatedWorks = this.works().map(w => {
      if (w.creatorName === oldName) {
        return {
          ...w,
          creatorName: updated.name,
          creatorAvatar: updated.avatar,
          location: updated.location,
          category: updated.category
        };
      }
      return w;
    });
    this.works.set(updatedWorks);
    this.persistWorks(updatedWorks);

    // Update bookings creator info
    const updatedBookings = this.bookings().map(b => {
      if (b.creatorName === oldName) {
        return {
          ...b,
          creatorName: updated.name
        };
      }
      return b;
    });
    this.bookings.set(updatedBookings);
    this.persistBookings(updatedBookings);
  }

  getWorkById(id: number): workType | undefined {
    return this.works().find(w => w.id === id);
  }
}
