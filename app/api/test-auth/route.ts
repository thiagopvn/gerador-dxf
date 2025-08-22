import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No auth header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log('Testing token verification...');
    
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      console.log('Token verified for user:', decodedToken.uid);
      
      // Test Firestore access
      const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
      console.log('Firestore access - user exists:', userDoc.exists);
      
      if (userDoc.exists) {
        const userData = userDoc.data();
        console.log('User data:', userData);
        
        return NextResponse.json({
          success: true,
          uid: decodedToken.uid,
          userData: userData
        });
      } else {
        return NextResponse.json({
          error: 'User not found in Firestore',
          uid: decodedToken.uid
        }, { status: 404 });
      }
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      return NextResponse.json({
        error: 'Token verification failed',
        details: tokenError instanceof Error ? tokenError.message : 'Unknown error'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}