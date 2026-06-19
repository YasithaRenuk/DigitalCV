import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import UserCV from "@/models/UserCV";
import Payment from "@/models/Payment";
import Coupon from "@/models/Coupon";
import { serverEnv } from "@/config/server-env";
import { autoDeactivateExpiredCoupons } from "@/lib/autoDeactivateCoupons";

const BASE_AMOUNT = 250000; // Rs. 2,500.00 in cents/smallest unit

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Auto-deactivate any expired or not-yet-active coupons before processing
    await autoDeactivateExpiredCoupons();

    const body = await request.json();
    const { userId, CVID, couponCode } = body;

    const report = await User.findById(userId);
    const CV = await UserCV.findById(CVID);

    if (!report) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    if (!CV) {
      return NextResponse.json({ error: "cv not found" }, { status: 404 });
    }

    let finalAmount = BASE_AMOUNT;
    let discountPercentage: number | undefined = undefined;
    let validatedCouponCode: string | undefined = undefined;

    // Validate coupon if provided
    if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
      const formattedCode = couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOne({ code: formattedCode }).lean() as any;

      if (!coupon) {
        return NextResponse.json({ error: "Coupon code not found." }, { status: 400 });
      }

      if (!coupon.isActive) {
        return NextResponse.json({ error: "Coupon code is inactive." }, { status: 400 });
      }

      const now = new Date();
      const start = new Date(coupon.startDate);
      const end = new Date(coupon.endDate);
      end.setHours(23, 59, 59, 999);

      if (now < start || now > end) {
        return NextResponse.json({ error: "Coupon code is expired or not yet valid." }, { status: 400 });
      }

      discountPercentage = coupon.discountPercentage;
      validatedCouponCode = formattedCode;
      const discountMultiplier = 1 - (coupon.discountPercentage / 100);
      finalAmount = Math.round(BASE_AMOUNT * discountMultiplier);
    }

    const transaction = new Payment({
      userID: userId,
      CVID: CVID,
      amount: finalAmount,
      originalAmount: BASE_AMOUNT,
      currency: 'LKR',
      status: 'PENDING',
      ...(validatedCouponCode && { couponCode: validatedCouponCode }),
      ...(discountPercentage !== undefined && { discountPercentage }),
    });

    await transaction.save();

    const Paymnetbody = {
      amount: transaction.amount,
      currency: transaction.currency,
      redirectUrl: serverEnv.nextAuthUrl + "/paymentStates",
      webhook: serverEnv.nextAuthUrl + "/api/savepayment",
      localId: transaction.id,
      customerReference: transaction.userID,
    };

    await Payment.findByIdAndUpdate(transaction.id, { rawRequest: Paymnetbody });

    const response = await fetch(serverEnv.genieApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": 'application/json',
        "Authorization": serverEnv.genieApiKey
      },
      body: JSON.stringify(Paymnetbody),
    });

    const apiResult = await response.json();

    return NextResponse.json(
      { success: true, url: apiResult.url },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error starting payment:", error);
    return NextResponse.json(
      { error: "Failed to start payment", details: error.message },
      { status: 500 }
    );
  }
}
