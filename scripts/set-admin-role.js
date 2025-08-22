const fetch = require('node-fetch');

const PROJECT_ID = 'remarcacao-chassi';
const API_KEY = 'AIzaSyDJfW9jfLM9BU2brzlgn3vGWc8f6KDmJWY';
const SIGNIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

async function setAdminRole() {
  const email = 'admin@remarcacao.com';
  const password = 'Admin@2024!';
  
  console.log('🔧 Setting admin role for user...');
  console.log('📧 Email:', email);
  
  try {
    // First, sign in to get the user ID token
    const signInResponse = await fetch(SIGNIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true
      })
    });
    
    const signInData = await signInResponse.json();
    
    if (!signInResponse.ok) {
      console.error('❌ Failed to sign in:', signInData.error?.message || 'Unknown error');
      return;
    }
    
    const { localId, idToken } = signInData;
    console.log('✅ User signed in successfully. UID:', localId);
    
    // Now create/update the user document in Firestore via REST API
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${localId}`;
    
    const userData = {
      fields: {
        email: { stringValue: email },
        name: { stringValue: 'Administrador' },
        role: { stringValue: 'admin' },
        isActive: { booleanValue: true },
        createdAt: { timestampValue: new Date().toISOString() },
        updatedAt: { timestampValue: new Date().toISOString() }
      }
    };
    
    const firestoreResponse = await fetch(firestoreUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(userData)
    });
    
    if (firestoreResponse.ok) {
      console.log('✅ Admin role set successfully in Firestore!');
      console.log('\n📌 Login credentials:');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('\n🔗 Access the admin panel at: http://localhost:3000/admin');
    } else {
      const firestoreError = await firestoreResponse.text();
      console.error('❌ Failed to update Firestore:', firestoreError);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setAdminRole();