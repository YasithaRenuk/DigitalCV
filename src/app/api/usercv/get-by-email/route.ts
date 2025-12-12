import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import UserCV from "@/models/UserCV";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const email = session.user.email;
    // console.log("email",email)

    if (!email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log("user",user)
    // Find all UserCVs for this user
    const userCVs = await UserCV.find({ userId: user._id })
      .select("username password states start_date end_date createdAt cv")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, userCVs }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching UserCVs by email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch UserCVs" },
      { status: 500 }
    );
  }
}
