import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const session = await auth();
    
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Fetch all users
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    console.log("users",users)

    // Prepare data for Excel
    const excelData = users.map((user: any) => ({
      'Full Name': user.name || 'N/A',
      'Email': user.email || 'N/A',
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Return the file
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=users_export_${new Date().toISOString().split('T')[0]}.xlsx`,
      },
    });

  } catch (error: any) {
    console.error('Error exporting users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to export users' },
      { status: 500 }
    );
  }
}
