import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import UserCV from "@/models/UserCV";
import Payment from "@/models/Payment";
import { sendProcessCompletedEmail } from "@/lib/sendEmail";

export async function POST( request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { localId,state } = body;

    const normalizedState = (state || "").toLowerCase();
    console.log("normalizedState:", normalizedState);

    const payment = await Payment.findByIdAndUpdate(
      localId,
      {
        transactionId:body.transactionId,
        rawResponse: body,
        status: state,
      },
      { new: true } 
    );

    if (!payment) {
      console.log("Payment not found for localId:", localId);
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }

    console.log("Updated payment:", payment);

    let cvStatus: "active" | "deactive" | null = null;
    
    if (normalizedState === "confirmed") {
      cvStatus = "active";
    } else if (normalizedState === "failed" || normalizedState === "cancelled") {
      cvStatus = "deactive";
    }

    if (!cvStatus) {
      console.log("No cvStatus derived from state, skipping UserCV update");
    } else if (!payment.CVID) {           
      console.log("Payment has no CVID field, cannot update UserCV");
    } else {
      console.log("Updating UserCV:", payment.CVID, "to status:", cvStatus);

      const updatedCv = await UserCV.findOneAndUpdate(
        { _id: payment.CVID },          // or { id: payment.CVID } if your schema uses `id`
        { $set: { states: cvStatus } },
        { new: true }
      );

      console.log("Updated UserCV:", updatedCv);

      if (normalizedState === "cancelled") {
        if(updatedCv != null){
          
          const user = await User.findById(updatedCv.userId);

          if(user != null){
            await sendProcessCompletedEmail({
              to: user.email,
              username: updatedCv.username,
              password: updatedCv.password,
              processName: "CV Generation",
    
            });
          }
          
        }
      }

      if (!updatedCv) {
        console.log("No UserCV found with id:", payment.CVID);
      }
    }
    
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