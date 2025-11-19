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

    const updateTransaction = await Payment.findByIdAndUpdate(
        localId,
        {
            rawResponse:body,
            status:state
        }
    )
    console.log("body",body)
    
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