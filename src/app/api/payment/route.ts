import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    // Fetch all payments
    const payments = await Payment.find({}).sort({ createdAt: -1 }).lean();

    // For each payment, fetch the user data
    const paymentsWithUserData = await Promise.all(
      payments.map(async (payment) => {
        let user = null;
        if (payment.userID) {
          try {
            user = await User.findById(payment.userID).select("name email").lean();
          } catch (err) {
            console.error(`Error fetching user ${payment.userID}:`, err);
          }
        }

        return {
          id: payment._id.toString(),
          userID: payment.userID,
          CVID: payment.CVID,
          amount: payment.amount,
          currency: payment.currency,
          genieTransactionId: payment.genieTransactionId || "",
          transactionId: payment.transactionId || "",
          status: payment.status,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
          user: user
            ? {
                name: user.name,
                email: user.email,
              }
            : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      payments: paymentsWithUserData,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch payments",
      },
      { status: 500 }
    );
  }
}
