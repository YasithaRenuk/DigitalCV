import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import UserCV from "@/models/UserCV";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "UserCV ID is required" },
        { status: 400 }
      );
    }

    const userCV = await UserCV.findById(id).select("cv");

    if (!userCV) {
      return NextResponse.json({ error: "UserCV not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, cv: userCV.cv }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching UserCV:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch UserCV" },
      { status: 500 }
    );
  }
}
