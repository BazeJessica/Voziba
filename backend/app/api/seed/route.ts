import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Work } from '@/models/Work';
import { Category } from '@/models/Category';
import { User } from '@/models/User';
import { Booking } from '@/models/Booking';

const categoriesData = [
  { name: 'Cleaning Services', icon: 'cleaning_services', count: 29, description: 'Professional residential cleaning, deep sanitization, laundry & eco-friendly maid services.', slug: 'cleaning-services' },
  { name: 'Tutoring & Education', icon: 'school', count: 34, description: 'Academic tutoring, language coaching, STEM mentoring & music instruction.', slug: 'tutoring-education' },
  { name: 'Caretaking & Caregiving', icon: 'family_restroom', count: 26, description: 'Senior assistance, child care, babysitting, pet sitting & household caretaking.', slug: 'caretaking-caregiving' },
  { name: 'Food & Beverages', icon: 'restaurant', count: 38, description: 'Artisanal catering, home-baked pastries, craft beverages & gourmet specialty foods.', slug: 'food-beverages' },
  { name: 'Beauty Services', icon: 'spa', count: 45, description: 'Bespoke hair styling, natural skincare, makeup artistry, and wellness services.', slug: 'beauty-services' },
  { name: 'Woodworking', icon: 'carpenter', count: 42, description: 'Handcrafted timber furniture, live-edge tables, and custom joinery.', slug: 'woodworking' },
  { name: 'Bespoke Tailoring', icon: 'dry_cleaning', count: 19, description: 'Custom fitted suits, hand-stitched garments, and artisan textiles.', slug: 'tailoring' },
  { name: 'Ceramics & Pottery', icon: 'soup_kitchen', count: 28, description: 'Wheel-thrown pottery, porcelain vases, and stoneware tableware.', slug: 'ceramics' },
  { name: 'Leathercraft', icon: 'content_cut', count: 35, description: 'Full-grain leather bags, wallets, belts, and bespoke footwear.', slug: 'leathercraft' },
  { name: 'Jewelry & Metals', icon: 'diamond', count: 50, description: 'Hand-forged rings, precious metals, and custom gemstone jewelry.', slug: 'jewelry' }
];

export async function executeSeed() {
  const startTime = Date.now();
  await connectDB();

  // 1. Seed Permanent Categories
  await Category.deleteMany({});
  const categories = await Category.insertMany(categoriesData);

  // 2. Seed Users (Consumers & Business Owners)
  await User.deleteMany({});
  const createdUsers = await User.create([
    {
      name: 'Jessica Miller',
      email: 'jessica@example.com',
      password: 'password123',
      role: 'consumer',
      phone: '+1 (555) 234-5678',
      bio: 'Collector of authentic handcrafted interior pieces, fine ceramics, and gourmet foods.',
    },
    {
      name: 'Alex Turner',
      email: 'alex.turner@example.com',
      password: 'password123',
      role: 'consumer',
      phone: '+1 (555) 876-5432',
      bio: 'Bespoke fashion enthusiast and leathercraft collector.',
    },
    {
      name: 'Chef Marco Rossi',
      email: 'marco@gourmet.com',
      password: 'artisan2026',
      role: 'business_owner',
      phone: '+1 (555) 111-2233',
      businessName: 'Rossi Artisanal Kitchen & Bakery',
      category: 'Food & Beverages',
      bio: 'Crafting artisan sourdoughs, gourmet charcuterie boards, and custom event catering.',
    },
    {
      name: 'Elena Vance',
      email: 'elena@glowbeauty.com',
      password: 'artisan2026',
      role: 'business_owner',
      phone: '+1 (555) 222-3344',
      businessName: 'Glow Organic Beauty & Spa',
      category: 'Beauty Services',
      bio: 'Holistic esthetician providing organic plant-based facials, hair styling, and bridal makeup.',
    },
    {
      name: 'Dr. Sarah Jenkins',
      email: 'sarah@edututor.com',
      password: 'artisan2026',
      role: 'business_owner',
      phone: '+1 (555) 444-5566',
      businessName: 'Jenkins Academic Prep & Tutoring',
      category: 'Tutoring & Education',
      bio: 'PhD educator offering 1-on-1 STEM tutoring, SAT/ACT test prep, and language coaching.',
    },
    {
      name: 'Maria Santos',
      email: 'maria@lovingcare.com',
      password: 'artisan2026',
      role: 'business_owner',
      phone: '+1 (555) 555-6677',
      businessName: 'Santos Family Caregiving Services',
      category: 'Caretaking & Caregiving',
      bio: 'Certified care provider offering elderly companionship, child caregiving, and pet sitting.',
    },
    {
      name: 'David Chen',
      email: 'david@sparkleclean.com',
      password: 'artisan2026',
      role: 'business_owner',
      phone: '+1 (555) 333-4455',
      businessName: 'PureLiving Eco Cleaning',
      category: 'Cleaning Services',
      bio: 'Eco-conscious residential deep cleaning, non-toxic sanitization, and organizational services.',
    },
    {
      name: 'Elias Vance',
      email: 'elias@woodworks.com',
      password: 'artisan2026',
      role: 'business_owner',
      phone: '+1 (555) 987-6543',
      businessName: 'Elias & Co. Woodworks',
      category: 'Woodworking',
      bio: 'Crafting heirloom walnut, oak, and cherry timber pieces in Portland since 2012.',
    },
    {
      name: 'Sienna Rossi',
      email: 'sienna@leather.com',
      password: 'artisan2026',
      role: 'business_owner',
      phone: '+1 (555) 432-8765',
      businessName: 'Sienna Leather Atelier',
      category: 'Leathercraft',
      bio: 'Master artisan creating hand-stitched vegetable-tanned Italian leather goods.',
    },
    {
      name: 'Maya Lin',
      email: 'maya@linceramics.com',
      password: 'artisan2026',
      role: 'business_owner',
      phone: '+1 (555) 321-9876',
      businessName: 'Lin Ceramics Studio',
      category: 'Ceramics & Pottery',
      bio: 'Minimalist wheel-thrown porcelain tableware and sculptural vases.',
    },
    {
      name: 'Arthur Pendelton',
      email: 'arthur@pendeltonmetals.com',
      password: 'artisan2026',
      role: 'business_owner',
      phone: '+1 (555) 654-3210',
      businessName: 'Pendelton Fine Metalsmiths',
      category: 'Jewelry & Metals',
      bio: 'Hand-forged recycled gold, sterling silver, and ethically sourced gem jewelry.',
    },
    {
      name: 'Mateo Gomez',
      email: 'mateo@gomezatelier.com',
      password: 'artisan2026',
      role: 'business_owner',
      phone: '+1 (555) 789-0123',
      businessName: 'Gomez Bespoke Tailoring',
      category: 'Bespoke Tailoring',
      bio: 'Master tailor specializing in bespoke suits, waistcoats, and custom linen outerwear.',
    }
  ]);

  const jessicaUser = createdUsers.find(u => u.email === 'jessica@example.com');
  const alexUser = createdUsers.find(u => u.email === 'alex.turner@example.com');
  const marcoUser = createdUsers.find(u => u.email === 'marco@gourmet.com');
  const elenaUser = createdUsers.find(u => u.email === 'elena@glowbeauty.com');
  const sarahUser = createdUsers.find(u => u.email === 'sarah@edututor.com');
  const mariaUser = createdUsers.find(u => u.email === 'maria@lovingcare.com');
  const davidUser = createdUsers.find(u => u.email === 'david@sparkleclean.com');
  const eliasUser = createdUsers.find(u => u.email === 'elias@woodworks.com');
  const siennaUser = createdUsers.find(u => u.email === 'sienna@leather.com');
  const mayaUser = createdUsers.find(u => u.email === 'maya@linceramics.com');
  const arthurUser = createdUsers.find(u => u.email === 'arthur@pendeltonmetals.com');
  const mateoUser = createdUsers.find(u => u.email === 'mateo@gomezatelier.com');

  // 3. Seed Handiwork & Service Listings
  await Work.deleteMany({});
  const createdWorks = await Work.insertMany([
    {
      title: '1-on-1 STEM & College Test Prep Tutoring Session',
      creatorId: sarahUser?._id,
      creatorName: 'Jenkins Academic Prep',
      creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      category: 'Tutoring & Education',
      description: 'Customized 60-minute tutoring session in High School / College Calculus, Physics, or SAT/ACT Test Prep.',
      price: 65,
      priceType: 'hourly',
      turnaround: 'Flexible Schedule',
      rating: 4.98,
      reviewsCount: 72,
      location: 'Boston, MA',
      img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
      tags: ['Tutoring', 'STEM', 'Calculus', 'SAT Prep', 'Education'],
    },
    {
      title: 'Compassionate Senior Care & In-Home Companionship',
      creatorId: mariaUser?._id,
      creatorName: 'Santos Family Caregiving Services',
      creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      category: 'Caretaking & Caregiving',
      description: 'Certified caregiver offering personalized senior companionship, meal preparation, medication reminders, and home assistance.',
      price: 35,
      priceType: 'hourly',
      turnaround: 'Flexible Booking',
      rating: 5.0,
      reviewsCount: 54,
      location: 'Miami, FL',
      img: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
      tags: ['Elderly Care', 'Senior Assistance', 'Caregiving', 'Caretaking'],
    },
    {
      title: 'Artisanal Sourdough & Gourmet Charcuterie Platter',
      creatorId: marcoUser?._id,
      creatorName: 'Rossi Artisanal Kitchen',
      creatorAvatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
      category: 'Food & Beverages',
      description: 'Handcrafted sourdough loaves paired with organic aged cheeses, cured meats, local honey, and seasonal preserves. Serves 10-12 guests.',
      price: 160,
      priceType: 'starting',
      turnaround: '48 hours',
      rating: 4.95,
      reviewsCount: 64,
      location: 'San Francisco, CA',
      img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      tags: ['Catering', 'Charcuterie', 'Sourdough', 'Gourmet'],
    },
    {
      title: 'Botanical Organic Glow Facial Treatment',
      creatorId: elenaUser?._id,
      creatorName: 'Glow Organic Beauty & Spa',
      creatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      category: 'Beauty Services',
      description: '60-minute soothing facial using cold-pressed rosehip oils, herbal steam, lymphatic facial massage, and customized clay mask.',
      price: 110,
      priceType: 'fixed',
      turnaround: 'Same Day Appointment',
      rating: 5.0,
      reviewsCount: 88,
      location: 'Los Angeles, CA',
      img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
      tags: ['Facial', 'Skincare', 'Spa', 'Organic'],
    },
    {
      title: 'Eco-Friendly Residential Deep Clean Package',
      creatorId: davidUser?._id,
      creatorName: 'PureLiving Eco Cleaning',
      creatorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      category: 'Cleaning Services',
      description: 'Complete home deep cleaning utilizing non-toxic, plant-based HEPA sanitization for up to 3 bedrooms and 2 bathrooms.',
      price: 220,
      priceType: 'fixed',
      turnaround: 'Flexible Booking',
      rating: 4.9,
      reviewsCount: 36,
      location: 'Denver, CO',
      img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
      tags: ['Deep Clean', 'Eco-Friendly', 'Sanitization', 'House Cleaning'],
    },
    {
      title: 'Handwoven Macramé Wall Hanging & Decor Set',
      creatorId: mayaUser?._id,
      creatorName: 'Lin Ceramics & Home Studio',
      creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      category: 'Home Decor & Interior',
      description: 'Large boho macramé tapestry hand-knotted from 100% organic unbleached cotton cord mounted on driftwood.',
      price: 145,
      priceType: 'fixed',
      turnaround: '3-5 days',
      rating: 4.85,
      reviewsCount: 31,
      location: 'Seattle, WA',
      img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      tags: ['Home Decor', 'Macrame', 'Boho', 'Tapestry'],
    },
    {
      title: 'Custom Solid Walnut Dining Table',
      creatorId: eliasUser?._id,
      creatorName: 'Elias & Co. Woodworks',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      category: 'Woodworking',
      description: 'Hand-milled solid Oregon black walnut dining table with live-edge finish and powder-coated steel base. Seats 8-10 comfortably.',
      price: 1850,
      priceType: 'starting',
      turnaround: '3-4 weeks',
      rating: 4.9,
      reviewsCount: 38,
      location: 'Portland, OR',
      img: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&auto=format&fit=crop&q=80',
      tags: ['Furniture', 'Walnut', 'Live Edge', 'Custom'],
    },
    {
      title: 'Hand-Stitched Italian Leather Tote',
      creatorId: siennaUser?._id,
      creatorName: 'Sienna Leather Atelier',
      creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      category: 'Leathercraft',
      description: 'Full-grain vegetable-tanned Italian leather tote bag with solid brass hardware, inner laptop compartment, and reinforced hand handles.',
      price: 340,
      priceType: 'fixed',
      turnaround: '1-2 weeks',
      rating: 5.0,
      reviewsCount: 52,
      location: 'Florence, SC',
      img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
      tags: ['Bags', 'Leather', 'Hand-Stitched', 'Italian'],
    },
    {
      title: 'Minimalist Porcelain Matcha Tea Set',
      creatorId: mayaUser?._id,
      creatorName: 'Lin Ceramics Studio',
      creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      category: 'Ceramics & Pottery',
      description: 'Wheel-thrown porcelain tea set including a ceremonial chawan bowl, bamboo whisk holder, and matching pourer in matte sage glaze.',
      price: 195,
      priceType: 'fixed',
      turnaround: '5-7 days',
      rating: 4.8,
      reviewsCount: 24,
      location: 'Seattle, WA',
      img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
      tags: ['Porcelain', 'Tea Set', 'Ceramics', 'Japanese'],
    },
    {
      title: 'Hand-Forged Hammered Gold Ring',
      creatorId: arthurUser?._id,
      creatorName: 'Pendelton Fine Metalsmiths',
      creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      category: 'Jewelry & Metals',
      description: '18k solid recycled yellow gold ring featuring an organic hand-hammered texture and comfort-fit inner band.',
      price: 680,
      priceType: 'starting',
      turnaround: '2 weeks',
      rating: 4.95,
      reviewsCount: 41,
      location: 'Austin, TX',
      img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      tags: ['Ring', 'Gold', 'Hand-Forged', 'Bespoke'],
    },
    {
      title: 'Custom Hand-Tailored Wool Blazer',
      creatorId: mateoUser?._id,
      creatorName: 'Gomez Bespoke Tailoring',
      creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      category: 'Bespoke Tailoring',
      description: 'Custom fitted unstructured blazer crafted from Italian Merino wool canvas, horn buttons, and hand-stitched lapels.',
      price: 920,
      priceType: 'starting',
      turnaround: '3 weeks',
      rating: 4.9,
      reviewsCount: 19,
      location: 'Chicago, IL',
      img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
      tags: ['Tailored', 'Blazer', 'Wool', 'Custom Suit'],
    }
  ]);

  const foodPlatter = createdWorks[0];
  const facialTreatment = createdWorks[1];
  const walnutTable = createdWorks[4];
  const leatherTote = createdWorks[5];

  // 4. Seed Relational Bookings
  await Booking.deleteMany({});
  const createdBookings = await Booking.create([
    {
      workId: foodPlatter._id,
      userId: jessicaUser?._id,
      creatorId: marcoUser?._id,
      workTitle: foodPlatter.title,
      creatorName: marcoUser?.name,
      customerName: jessicaUser?.name,
      customerEmail: jessicaUser?.email,
      customerPhone: jessicaUser?.phone,
      bookingDate: '2026-08-28',
      status: 'In Progress',
      totalPrice: foodPlatter.price,
      customNotes: 'Include extra aged parmesan and gluten-free sourdough loaf option.',
    },
    {
      workId: facialTreatment._id,
      userId: alexUser?._id,
      creatorId: elenaUser?._id,
      workTitle: facialTreatment.title,
      creatorName: elenaUser?.name,
      customerName: alexUser?.name,
      customerEmail: alexUser?.email,
      customerPhone: alexUser?.phone,
      bookingDate: '2026-08-22',
      status: 'Completed',
      totalPrice: facialTreatment.price,
      customNotes: 'Sensitive skin botanical oils requested.',
    },
    {
      workId: walnutTable._id,
      userId: jessicaUser?._id,
      creatorId: eliasUser?._id,
      workTitle: walnutTable.title,
      creatorName: eliasUser?.name,
      customerName: jessicaUser?.name,
      customerEmail: jessicaUser?.email,
      customerPhone: jessicaUser?.phone,
      bookingDate: '2026-08-25',
      status: 'In Progress',
      totalPrice: walnutTable.price,
      customNotes: 'Please stain slightly darker walnut tone.',
    },
    {
      workId: leatherTote._id,
      userId: alexUser?._id,
      creatorId: siennaUser?._id,
      workTitle: leatherTote.title,
      creatorName: siennaUser?.name,
      customerName: alexUser?.name,
      customerEmail: alexUser?.email,
      customerPhone: alexUser?.phone,
      bookingDate: '2026-08-18',
      status: 'Completed',
      totalPrice: leatherTote.price,
      customNotes: 'Engrave initials A.T. on inner pocket flap.',
    }
  ]);

  const elapsedTime = Date.now() - startTime;

  return {
    message: 'MongoDB database successfully seeded with constant categories and services dataset!',
    executionTimeMs: elapsedTime,
    counts: {
      categories: categories.length,
      users: createdUsers.length,
      works: createdWorks.length,
      bookings: createdBookings.length,
    }
  };
}

export async function POST() {
  try {
    const result = await executeSeed();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await executeSeed();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
