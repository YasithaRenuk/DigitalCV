import UserCV from "@/models/UserCV";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const id = body.id;

  console.log("Received ID:", id);

  // Now you can use the id for DB queries
  const userCV = await UserCV.findById(id);

  if (!userCV) {
    return NextResponse.json({ success: false, error: "User CV not found" }, { status: 404 });
  }

  if (!userCV.cv) {
    return NextResponse.json({ success: false, error: "CV data is empty" }, { status: 400 });
  }

  return NextResponse.json({ success: true, data: JSON.parse(userCV.cv) });
}
