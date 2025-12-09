import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import UserCV from '@/models/UserCV';
import User from '@/models/User';

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
    
    const existingUserCV  = await UserCV.findOne({"username":username})
    
    if (existingUserCV) {
      return NextResponse.json(
        { error: 'Username already exists. Please choose a different username.' },
        { status: 409 }
      );
    }

    const apiFormData = new FormData();

    cvFiles.forEach((file) => {
      apiFormData.append('file', file);
    });

    const ocrResponse = await fetch(process.env.AI_URL + '/cv/ocr-and-structure',
      {
        method: 'POST',
        body: apiFormData,
      }
    );
    
    let ocrJson: any = null;
    ocrJson = await ocrResponse.json();
    
    if (!ocrResponse.ok) {
      // validation error (422)
      if (ocrResponse.status === 422 && ocrJson?.detail) {
        return NextResponse.json(
          {
            error: 'CV validation failed on OCR service',
            details: ocrJson.detail,
          },
          { status: 422 }
        );
      }

      // Other errors from OCR service
      return NextResponse.json(
        {
          error: 'Failed to process CV with OCR service',
          details: ocrJson || null,
        },
        { status: 502 }
      );
    }
    
    // console.log("ocrJson",ocrJson)

    const payloadForEnhance = {
      ...ocrJson,
      certifications: ocrJson.certifications ?? [],
      projects: ocrJson.projects ?? [],
      extracurricular_activities: ocrJson.extracurricular_activities ?? [],
      achievements: ocrJson.achievements ?? [],
      references: ocrJson.references ?? [],
    };

    const enhanceCVResponse = await fetch(process.env.AI_URL + '/cv/enhance',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadForEnhance),
      }
    );

    // console.log("enhanceCVResponse",enhanceCVResponse)

    let enhanceCVJson: any = null;
    enhanceCVJson = await enhanceCVResponse.json();

    if (!enhanceCVResponse.ok) {
      // validation error (422)
      if (enhanceCVResponse.status === 422 && enhanceCVJson?.detail) {
        return NextResponse.json(
          {
            error: 'CV validation failed on OCR service',
            details: enhanceCVJson.detail,
          },
          { status: 422 }
        );
      }

      // Other errors from OCR service
      return NextResponse.json(
        {
          error: 'Failed to process CV with OCR service',
          details: enhanceCVJson || null,
        },
        { status: 502 }
      );
    }

    // console.log("enhanceCVJson",enhanceCVJson)

    // Calculate dates
    const start_date = new Date();
    const end_date = new Date();
    end_date.setMonth(end_date.getMonth() + 6); // 6 months after start_date

    // Create UserCV document
    const userCV = await UserCV.create({
      username,
      password,
      cv:JSON.stringify(enhanceCVJson) , 
      states: 'pending',
      start_date,
      end_date,
      userId: (session.user as any).id,
    });

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

// GET all UserCV records with user information
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

    const userCVs = await UserCV.find({}).sort({ createdAt: -1 }).lean();
    
    // Fetch user information for each UserCV
    const userCVsWithUserInfo = await Promise.all(
      userCVs.map(async (userCV: any) => {
        const user = await User.findById(userCV.userId);
        return {
          id: userCV._id.toString(),
          username: userCV.username,
          password: userCV.password,
          states: userCV.states,
          start_date: userCV.start_date,
          end_date: userCV.end_date,
          createdAt: userCV.createdAt,
          user: user ? {
            name: user.name,
            email: user.email,
          } : null,
        };
      })
    );

    return NextResponse.json(
      { success: true, userCVs: userCVsWithUserInfo },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching UserCVs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch UserCVs' },
      { status: 500 }
    );
  }
}

// DELETE a UserCV record
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
        { error: 'UserCV ID is required' },
        { status: 400 }
      );
    }

    const deletedUserCV = await UserCV.findByIdAndDelete(id);

    if (!deletedUserCV) {
      return NextResponse.json(
        { error: 'UserCV not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'UserCV deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting UserCV:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete UserCV' },
      { status: 500 }
    );
  }
}

// PUT/PATCH update a UserCV record
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

    const { id, username, password, start_date, end_date } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'UserCV ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (username) updateData.username = username;
    if (password) updateData.password = password;
    if (start_date) updateData.start_date = new Date(start_date);
    if (end_date) updateData.end_date = new Date(end_date);

    const updatedUserCV = await UserCV.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUserCV) {
      return NextResponse.json(
        { error: 'UserCV not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'UserCV updated successfully',
        userCV: {
          id: (updatedUserCV as any)._id?.toString(),
          username: (updatedUserCV as any).username,
          password: (updatedUserCV as any).password,
          states: (updatedUserCV as any).states,
          start_date: (updatedUserCV as any).start_date,
          end_date: (updatedUserCV as any).end_date,
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating UserCV:', error);
    
    // Handle duplicate username error
    if (error.code === 11000 && error.keyPattern?.username) {
      return NextResponse.json(
        { error: 'Username already exists. Please choose a different username.' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to update UserCV' },
      { status: 500 }
    );
  }
}

