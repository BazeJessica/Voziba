import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Work } from '@/models/Work';
import { Category } from '@/models/Category';
import { Booking } from '@/models/Booking';
import { User } from '@/models/User';
import mongoose from 'mongoose';

export async function GET() {
  const overallStart = Date.now();

  try {
    // 1. Measure DB Connection Latency
    const dbStart = Date.now();
    await connectDB();
    const dbPingStart = Date.now();
    await mongoose.connection.db?.admin().ping();
    const dbPingMs = Date.now() - dbPingStart;
    const dbConnectTotalMs = Date.now() - dbStart;

    // 2. Measure Works Query Latency
    const worksStart = Date.now();
    const works = await Work.find({}).limit(20).lean();
    const worksQueryMs = Date.now() - worksStart;

    // 3. Measure Categories Query Latency
    const catStart = Date.now();
    const categories = await Category.find({}).lean();
    const categoriesQueryMs = Date.now() - catStart;

    // 4. Measure Bookings Query Latency
    const bookingStart = Date.now();
    const bookings = await Booking.find({}).lean();
    const bookingsQueryMs = Date.now() - bookingStart;

    // 5. Measure Users Query Latency
    const userStart = Date.now();
    const usersCount = await User.countDocuments();
    const usersQueryMs = Date.now() - userStart;

    const totalLatencyMs = Date.now() - overallStart;
    const memUsage = process.memoryUsage();

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      latency: {
        dbPingMs,
        dbConnectTotalMs,
        worksQueryMs,
        categoriesQueryMs,
        bookingsQueryMs,
        usersQueryMs,
        totalServerLatencyMs: totalLatencyMs,
      },
      counts: {
        works: works.length,
        categories: categories.length,
        bookings: bookings.length,
        users: usersCount,
      },
      system: {
        nodeVersion: process.version,
        memoryHeapUsedMB: Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100,
        memoryRssMB: Math.round((memUsage.rss / 1024 / 1024) * 100) / 100,
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      totalLatencyMs: Date.now() - overallStart,
    }, { status: 500 });
  }
}
