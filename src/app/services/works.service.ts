import { Injectable, signal, computed } from '@angular/core';
import { workType, categoryType, bookingType, testimonyType } from '../models/types';

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
    return [];
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
      id: 'BK-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const updated = [booking, ...this.bookings()];
    this.bookings.set(updated);
    this.persistBookings(updated);
    return booking;
  }

  getWorkById(id: number): workType | undefined {
    return this.works().find(w => w.id === id);
  }
}
