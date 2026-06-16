import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import CouponUsage from '@/models/CouponUsage';

// GET all coupons
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const fetchUsages = searchParams.get('usages') === '1';

    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();

    const couponsList = coupons.map((coupon: any) => ({
      id: coupon._id.toString(),
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      isActive: coupon.isActive,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      referenceName: coupon.referenceName,
      usedCount: coupon.usedCount ?? 0,
      createdAt: coupon.createdAt,
    }));

    if (fetchUsages) {
      const usages = await CouponUsage.find({}).sort({ createdAt: -1 }).lean();
      const usageList = usages.map((u: any) => ({
        id: u._id.toString(),
        couponCode: u.couponCode,
        userId: u.userId,
        userEmail: u.userEmail,
        userName: u.userName,
        cvId: u.cvId,
        paymentId: u.paymentId,
        discountPercentage: u.discountPercentage,
        discountAmount: u.discountAmount,
        createdAt: u.createdAt,
      }));
      return NextResponse.json(
        { success: true, coupons: couponsList, usages: usageList },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, coupons: couponsList },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

// POST create a coupon
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { code, discountPercentage, isActive, startDate, endDate, referenceName } = await request.json();

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Valid coupon code is required' }, { status: 400 });
    }

    if (discountPercentage === undefined || typeof discountPercentage !== 'number' || discountPercentage < 0 || discountPercentage > 100) {
      return NextResponse.json({ error: 'Discount percentage must be a number between 0 and 100' }, { status: 400 });
    }

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Start date and End date are required' }, { status: 400 });
    }

    const formattedCode = code.trim().toUpperCase();

    // Check uniqueness
    const existing = await Coupon.findOne({ code: formattedCode });
    if (existing) {
      return NextResponse.json({ error: 'Coupon code already exists and must be unique' }, { status: 400 });
    }

    const newCoupon = await Coupon.create({
      code: formattedCode,
      discountPercentage,
      isActive: isActive !== false, // default true
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      referenceName: referenceName ? referenceName.trim() : undefined,
    });

    return NextResponse.json(
      { 
        success: true, 
        coupon: {
          id: (newCoupon as any)._id.toString(),
          code: newCoupon.code,
          discountPercentage: newCoupon.discountPercentage,
          isActive: newCoupon.isActive,
          startDate: newCoupon.startDate,
          endDate: newCoupon.endDate,
          referenceName: newCoupon.referenceName,
        } 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create coupon' },
      { status: 500 }
    );
  }
}

// PUT update a coupon
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id, code, discountPercentage, isActive, startDate, endDate, referenceName } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 });
    }

    const updateFields: any = {};

    if (code !== undefined) {
      if (typeof code !== 'string' || !code.trim()) {
        return NextResponse.json({ error: 'Valid coupon code is required' }, { status: 400 });
      }
      const formattedCode = code.trim().toUpperCase();
      
      // Check uniqueness against other coupons
      const existing = await Coupon.findOne({ code: formattedCode, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
      }
      updateFields.code = formattedCode;
    }

    if (discountPercentage !== undefined) {
      if (typeof discountPercentage !== 'number' || discountPercentage < 0 || discountPercentage > 100) {
        return NextResponse.json({ error: 'Discount percentage must be a number between 0 and 100' }, { status: 400 });
      }
      updateFields.discountPercentage = discountPercentage;
    }

    if (isActive !== undefined) {
      updateFields.isActive = !!isActive;
    }

    if (startDate !== undefined) {
      updateFields.startDate = new Date(startDate);
    }

    if (endDate !== undefined) {
      updateFields.endDate = new Date(endDate);
    }

    if (referenceName !== undefined) {
      updateFields.referenceName = referenceName ? referenceName.trim() : '';
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json(
      { 
        success: true, 
        coupon: {
          id: (updatedCoupon as any)._id.toString(),
          code: updatedCoupon.code,
          discountPercentage: updatedCoupon.discountPercentage,
          isActive: updatedCoupon.isActive,
          startDate: updatedCoupon.startDate,
          endDate: updatedCoupon.endDate,
          referenceName: updatedCoupon.referenceName,
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

// DELETE a coupon
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    const deleted = await Coupon.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Coupon deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}
