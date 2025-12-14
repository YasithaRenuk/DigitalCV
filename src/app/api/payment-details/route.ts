import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import UserCV from "@/models/UserCV";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transactionId");

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    // Find the payment by transaction ID
    const payment = await Payment.findOne({transactionId:transactionId});

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Find the UserCV using the CVID from the payment
    const userCV = await UserCV.findById(payment.CVID);

    if (!userCV) {
      return NextResponse.json(
        { error: "CV not found" },
        { status: 404 }
      );
    }

    // Return username and password (PIN)
    return NextResponse.json(
      {
        success: true,
        username: userCV.username,
        pin: userCV.password,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching payment details:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment details", details: error.message },
      { status: 500 }
    );
  }
}
