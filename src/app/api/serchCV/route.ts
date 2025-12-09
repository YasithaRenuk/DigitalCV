import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserCV from "@/models/UserCV";

export async function POST(request: NextRequest) {
  try {
    const { username, pin } = await request.json();

    if (!username || !pin) {
      return NextResponse.json(
        { success: false, error: "Username and PIN are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const userCV = await UserCV.findOne({ username: username.trim() });

    if (!userCV) {
      return NextResponse.json(
        { success: false, error: "Username not found" },
        { status: 404 }
      );
    }

    if (userCV.states == 'pending') {
      return NextResponse.json(
        { success: false, error: "User Payment is pending" },
        { status: 404 }
      );
    }

    if (userCV.states == 'deactive') {
      return NextResponse.json(
        { success: false, error: "User Account is deactive" },
        { status: 404 }
      );
    }

    if (userCV.password !== pin) {
      return NextResponse.json(
        { success: false, error: "Invalid PIN" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      id: (userCV._id as any).toString(),
    });
    
  } catch (error) {
    console.error("Error searching CV:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search CV" },
      { status: 500 }
    );
  }
}
