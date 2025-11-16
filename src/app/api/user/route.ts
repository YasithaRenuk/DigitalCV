import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import UserCV from '@/models/UserCV';

// GET all users
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const users = await User.find({}).sort({ createdAt: -1 }).lean();

    const usersList = users.map((user: any) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      createdAt: user.createdAt,
    }));

    return NextResponse.json(
      { success: true, users: usersList },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// DELETE a user and all related UserCV records
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find the user first
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete all related UserCV records
    const deleteUserCVsResult = await UserCV.deleteMany({ userId: id.toString() });
    console.log(`Deleted ${deleteUserCVsResult.deletedCount} UserCV records for user ${id}`);

    // Delete the user
    await User.findByIdAndDelete(id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'User and related UserCV records deleted successfully',
        deletedUserCVs: deleteUserCVsResult.deletedCount
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}

// PUT/PATCH update user role
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id, role } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!role || (role !== 'user' && role !== 'admin')) {
      return NextResponse.json(
        { error: 'Valid role (user or admin) is required' },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'User role updated successfully',
        user: {
          id: (updatedUser as any)._id?.toString(),
          name: (updatedUser as any).name,
          email: (updatedUser as any).email,
          role: (updatedUser as any).role,
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user role' },
      { status: 500 }
    );
  }
}

