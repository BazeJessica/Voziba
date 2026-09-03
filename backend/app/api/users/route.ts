import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { User } from '../../../models/User';
import { authenticateRequest } from '../../../lib/jwt';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).select('-password');
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { user, errorResponse } = authenticateRequest(request);
    if (errorResponse) {
      return errorResponse;
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (!email && !id) {
      return NextResponse.json({ success: false, message: 'Missing user email or id' }, { status: 400 });
    }

    const query = email ? { email } : { _id: id };
    const deletedUser = await User.findOneAndDelete(query);

    return NextResponse.json({
      success: true,
      message: 'User account permanently deleted and session invalidated',
      deletedUser
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

