import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import UserCV from "@/models/UserCV";
import Payment from "@/models/Payment";

export async function POST( request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { localId,state } = body;

    const normalizedState = (state || "").toLowerCase();

    const payment = await Payment.findByIdAndUpdate(
      localId,
      {
        rawResponse: body,
        status: state,
      },
      { new: true } 
    );

    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }

    let cvStatus: "active" | "deactive" | null = null;
    
    if (normalizedState === "confirmed") {
      cvStatus = "active";
    } else if (normalizedState === "failed" || normalizedState === "faild") {
      cvStatus = "deactive";
    }

    if (cvStatus && payment.CVID) {
      await UserCV.findByIdAndUpdate(payment.CVID, { status: cvStatus });
    }

    // console.log("body",body)
    
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Failed to fetch report", details: error.message },
      { status: 500 }
    );
  }
}