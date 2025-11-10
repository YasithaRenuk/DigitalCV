import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { firstName, lastName, topic, message,email } = body;

    // Validate required fields
    if (!firstName || !topic || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new report
    const report = new Report({
      fristname: firstName, 
      lastname: lastName || "",
      topic: topic,
      message: message,
      email:email
    });

    await report.save();

    return NextResponse.json(
      {
        success: true,
        report: {
          id: report._id,
          firstName: report.fristname,
          lastName: report.lastname,
          topic: report.topic,
          message: report.message,
          createdAt: report.createdAt,
          email: report.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const reports = await Report.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        reports: reports.map((report) => ({
          id: report._id,
          firstName: report.fristname,
          lastName: report.lastname,
          topic: report.topic,
          message: report.message,
          createdAt: report.createdAt,
          email: report.email,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid request. 'ids' array is required." },
        { status: 400 }
      );
    }

    const result = await Report.deleteMany({ _id: { $in: ids } });

    return NextResponse.json(
      {
        success: true,
        message: `Deleted ${result.deletedCount} report(s)`,
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting reports:", error);
    return NextResponse.json(
      { error: "Failed to delete reports", details: error.message },
      { status: 500 }
    );
  }
}