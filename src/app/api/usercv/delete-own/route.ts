import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import UserCV from "@/models/UserCV";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "CV ID is required" }, { status: 400 });
    }

    await connectDB();

    const userCV = await UserCV.findById(id);

    if (!userCV) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    // Check ownership
    // If admin, they can delete any (though this specific endpoint is 'delete-own', reuse logic if helpful)
    // But requirement is 'delete-own', so typically strict.
    // However, for admin panel usage, we might need admin override.
    // But wait, the admin panel uses the generalized DELETE endpoint usually?
    // Let's check `api/usercv/route.ts` DELETE method. It exists and is admin-only.
    // So this endpoint is SPECIFICALLY for the regular user on `showcv` page.
    // Re-verify: User on `showcv` page is the owner of the CV.

    const currentUserId = (session.user as any).id;
    
    if (userCV.userId.toString() !== currentUserId) {
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
