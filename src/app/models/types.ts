export interface categoryType {
  id: number;
  name: string;
  description: string;
  icon: string;
  itemCount: number;
}

export interface workType {
  id: number;
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

export interface bookingType {
  id: string;
  workId: number;
  workTitle: string;
  creatorName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  customNotes?: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
}

export interface testimonyType {
  id: number;
  customerName: string;
  customerRole: string;
  avatar: string;
  workTitle: string;
  creatorName: string;
  comment: string;
  rating: number;
}