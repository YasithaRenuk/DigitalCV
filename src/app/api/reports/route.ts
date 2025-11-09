import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { firstName, lastName, topic, message } = body;

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

    const reports = await Report.find().sort({ createdAt: -1 }).limit(10);

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