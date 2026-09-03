import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Work } from '@/models/Work';
import { authenticateRequest } from '@/lib/jwt';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const query: any = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { creatorName: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const works = await Work.find(query).sort({ createdAt: -1 });
    return NextResponse.json(works);
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

    if (user?.role !== 'business_owner') {
      return NextResponse.json(
        { error: 'Forbidden: Only business owners can create new handiworks.' },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await req.json();

    const newWork = await Work.create(body);
    return NextResponse.json(newWork, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

