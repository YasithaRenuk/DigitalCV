import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import UserCV from "@/models/UserCV";
import Payment from "@/models/Payment";

export async function POST( request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId,CVID } = body;
 
    const report = await User.findById(userId);
    const CV = await UserCV.findById(CVID);

    if (!report) {
      return NextResponse.json(
        { error: "user not found" },
        { status: 404 }
      );
    }

    if (!CV) {
      return NextResponse.json(
        { error: "cv not found" },
        { status: 404 }
      );
    }
     
    const transaction = new Payment({
      userID:userId,
      CVID : CVID,
      amount: 250000,
      currency : 'LKR',
      status : 'PENDING'
    })

    await transaction.save();

    const Paymnetbody = {
      amount:transaction.amount,
      currency:transaction.currency,
      redirectUrl:process.env.NEXTAUTH_URL as string + "/paymentStates",
      // webhook:process.env.NEXTAUTH_URL as string + "/api/savepayment",
      localId:transaction.id,
      customerReference:transaction.userID,
      tokenizationDetails:{
        tokenize:false,
        paymentType:"UNSCHEDULED"
      }
    }

    const updateTransaction = await Payment.findByIdAndUpdate(
      transaction.id,
      {
        rawRequest: Paymnetbody
      }
    )

    const response = await fetch(process.env.GENIE_API_URL as string , {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": 'application/json',
        "Authorization":  process.env.GENIE_API_KEY as string 
      },
      body:JSON.stringify(Paymnetbody) ,
    });

    const apiResult = await response.json();

    // console.log("Paymnet body:", Paymnetbody)
    // console.log("API result:", apiResult);

    return NextResponse.json(
      {
        success: true,
        url:apiResult.url
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