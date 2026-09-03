import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { email, password, role } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email. Please sign up first.' },
        { status: 404 }
      );
    }

    // Compare the candidate password against the stored bcrypt hash
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password. Please try again.' },
        { status: 401 }
      );
    }

    const detectedRole: 'consumer' | 'business_owner' = user.role === 'business_owner' ? 'business_owner' : 'consumer';
    const targetRoute = detectedRole === 'business_owner' ? '/business-dashboard' : '/profile';

    // Generate JWT access token (15m) and refresh token (7d)
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: detectedRole
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return NextResponse.json({
      message: 'Login successful!',
      accessToken,
      refreshToken,
      token: accessToken, // Backwards compatibility alias
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: detectedRole,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        businessName: user.businessName,
        category: user.category,
      },
      targetRoute,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


