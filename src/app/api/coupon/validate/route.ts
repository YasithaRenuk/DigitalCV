import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const formattedCode = code.trim().toUpperCase();

    const coupon = await Coupon.findOne({ code: formattedCode }).lean() as any;

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon code not found. Please check and try again.' }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'This coupon code is inactive.' }, { status: 400 });
    }

    const now = new Date();
    const start = new Date(coupon.startDate);
    const end = new Date(coupon.endDate);
    end.setHours(23, 59, 59, 999);

    if (now < start) {
      return NextResponse.json({ error: 'This coupon code is not yet valid. It becomes active on ' + start.toLocaleDateString() + '.' }, { status: 400 });
    }

    if (now > end) {
      return NextResponse.json({ error: 'This coupon code has expired.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon._id.toString(),
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        referenceName: coupon.referenceName,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ error: error.message || 'Failed to validate coupon' }, { status: 500 });
  }
}
