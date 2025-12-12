import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import UserCV from "@/models/UserCV";
import User from "@/models/User";

async function handleDelete(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "CV ID is required" }, { status: 400 });
    }

    await connectDB();

    // Find the user by email
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userCV = await UserCV.findById(id);

    if (!userCV) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    // Check ownership - compare with userId field
    if (userCV.userId !== (user._id as any).toString()) {
      return NextResponse.json({ error: "You are not authorized to delete this CV" }, { status: 403 });
    }

    await UserCV.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "CV deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting CV:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete CV" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return handleDelete(request);
}

export async function DELETE(request: NextRequest) {
  return handleDelete(request);
}
