import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  workId: mongoose.Types.ObjectId | string;
  userId?: mongoose.Types.ObjectId;
  creatorId?: mongoose.Types.ObjectId;
  workTitle: string;
  creatorName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  bookingDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  totalPrice: number;
  customNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema<IBooking> = new Schema(
  {
    workId: { type: Schema.Types.ObjectId, ref: 'Work', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User' },
    workTitle: { type: String, required: true },
    creatorName: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, lowercase: true },
    customerPhone: { type: String, default: '' },
    bookingDate: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    totalPrice: { type: Number, required: true },
    customNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
