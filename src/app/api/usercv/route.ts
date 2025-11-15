import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import UserCV from '@/models/UserCV';

export async function POST(request: NextRequest) {
  try {
    // Get the session to verify user is authenticated
    const session = await auth();
    
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Parse form data
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const cvFiles = formData.getAll('cvFiles') as File[];

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Calculate dates
    const start_date = new Date();
    const end_date = new Date();
    end_date.setMonth(end_date.getMonth() + 6); // 6 months after start_date

    // Create UserCV document
    const userCV = await UserCV.create({
      username,
      password,
      cv: null, // Leave as null for now
      states: 'pending',
      start_date,
      end_date,
      userId: (session.user as any).id,
    });

    // Files are accepted but not processed (as per requirements)
    // You can access them via cvFiles if needed in the future

    return NextResponse.json(
      { 
        message: 'UserCV created successfully',
        userCV: {
          id: userCV._id,
          username: userCV.username,
          states: userCV.states,
          start_date: userCV.start_date,
          end_date: userCV.end_date,
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating UserCV:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create UserCV' },
      { status: 500 }
    );
  }
}

