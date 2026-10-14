export interface categoryType {
  id: number;
  _id?: string;
  name: string;
  description: string;
  icon: string;
  itemCount: number;
}

export interface workType {
  id: number;
  _id?: string;
  creatorId?: string;
  title: string;
  creatorName: string;
  creatorAvatar: string;
  category: string;
  description: string;
  price: number;
  priceType: 'fixed' | 'starting' | 'hourly';
  turnaround: string;
  rating: number;
  reviewsCount: number;
  location: string;
  img: string;
  gallery?: string[];
  featured?: boolean;
  tags: string[];
}

export interface userProfileType {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  preferredCategories: string[];
  role?: 'consumer' | 'business_owner';
  businessName?: string;
  category?: string;
}

export interface bookingType {
  id: string;
  _id?: string;
  workId: number | string;
  userId?: string;
  creatorId?: string;
  workTitle: string;
  creatorName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  customNotes?: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface testimonyType {
  id: number;
  _id?: string;
  customerName: string;
  customerRole: string;
  avatar: string;
  workTitle: string;
  creatorName: string;
  comment: string;
  rating: number;
}

export interface businessProfileType {
  _id?: string;
  ownerId?: string;
  name: string;
  avatar: string;
  category: string;
  location: string;
  bio: string;
  email: string;
  phone: string;
  businessHours: string;
  establishedYear: string;
}