import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, email, password, role, phone, bio, businessName, category } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required fields.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Password is required and must be at least 8 characters.' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const selectedRole: 'consumer' | 'business_owner' = role === 'business_owner' ? 'business_owner' : 'consumer';

    // Password is automatically hashed by the User model pre-save hook
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: selectedRole,
      phone: phone || '',
      bio: bio || (selectedRole === 'business_owner' ? 'Artisanal Studio' : 'Craft Enthusiast'),
      businessName: businessName || (selectedRole === 'business_owner' ? `${name}'s Workshop` : ''),
      category: category || '',
    });

    const targetRoute = selectedRole === 'business_owner' ? '/business-dashboard' : '/profile';

    // Generate JWT access token (15m) and refresh token (7d)
    const payload = {
      userId: newUser._id.toString(),
      email: newUser.email,
      role: selectedRole
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return NextResponse.json({
      message: 'Account created successfully!',
      accessToken,
      refreshToken,
      token: accessToken, // Backwards compatibility alias
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        phone: newUser.phone,
        bio: newUser.bio,
        businessName: newUser.businessName,
        category: newUser.category,
      },
      targetRoute,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


