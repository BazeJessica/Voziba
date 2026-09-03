import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Booking } from '@/models/Booking';
import { authenticateRequest } from '@/lib/jwt';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const creator = searchParams.get('creator');

    const query: any = {};
    if (email) {
      query.customerEmail = email.toLowerCase();
    }
    if (creator) {
      query.creatorName = { $regex: creator, $options: 'i' };
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user, errorResponse } = authenticateRequest(req);
    if (errorResponse) {
      return errorResponse;
    }

    await connectDB();
    const body = await req.json();

    const newBooking = await Booking.create({
      ...body,
      customerEmail: user?.email || body.customerEmail
    });
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

