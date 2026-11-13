import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'voziba-access-secret-key-15m-2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'voziba-refresh-secret-key-7d-2026';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'consumer' | 'business_owner';
}

export function signAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' });
}


export function signRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function signToken(payload: JWTPayload): string {
  return signAccessToken(payload);
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function verifyToken(token: string): JWTPayload | null {
  return verifyAccessToken(token);
}

export function extractTokenFromHeader(req: Request): string | null {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7).trim();
}

export function authenticateRequest(req: Request): { user: JWTPayload | null; errorResponse: NextResponse | null } {
  const token = extractTokenFromHeader(req);
  if (!token) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: 'Unauthorized: Missing or malformed Authorization header with Bearer token.' },
        { status: 401 }
      )
    };
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: 'Unauthorized: Access token has expired or is invalid.' },
        { status: 401 }
      )
    };
  }

  return { user: payload, errorResponse: null };
}
