import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/auth-utils';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const token = await getAccessToken();
    const body = (await req.json()) as unknown;
    const res = await fetch(`${BASE}/api/v1/export-documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as unknown;
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
