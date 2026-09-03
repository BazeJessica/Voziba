import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { verifyRefreshToken, signAccessToken, signRefreshToken, extractTokenFromHeader } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    
    // Support refresh token passed in JSON body or Authorization header
    const tokenFromHeader = extractTokenFromHeader(req);
    const refreshToken = body.refreshToken || tokenFromHeader;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required.' },
        { status: 400 }
      );
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token. Please log in again.' },
        { status: 401 }
      );
    }

    // Verify user still exists in database
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User account not found.' },
        { status: 404 }
      );
    }

    const role: 'consumer' | 'business_owner' = user.role === 'business_owner' ? 'business_owner' : 'consumer';

    // Issue new token pair
    const newAccessToken = signAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role
    });

    const newRefreshToken = signRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role
    });

    return NextResponse.json({
      message: 'Tokens refreshed successfully.',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      token: newAccessToken, // Backwards compatibility alias
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        businessName: user.businessName,
        category: user.category,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
