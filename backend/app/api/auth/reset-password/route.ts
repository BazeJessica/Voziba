import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { email, newPassword } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters long.' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address. Please check your spelling or sign up.' },
        { status: 404 }
      );
    }

    // Update user password and save (triggers pre-save bcrypt hashing)
    user.password = newPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
      email: user.email
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error resetting password' }, { status: 500 });
  }
}
