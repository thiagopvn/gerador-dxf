const fetch = require('node-fetch');

const API_KEY = 'AIzaSyDJfW9jfLM9BU2brzlgn3vGWc8f6KDmJWY';
const SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

async function createAdminUser() {
  const email = 'admin@remarcacao.com';
  const password = 'Admin@2024!';
  
  console.log('🔧 Setting up admin user...');
  console.log('📧 Email:', email);
  console.log('🔑 Password:', password);
  
  try {
    const response = await fetch(SIGNUP_URL, {
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
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ Admin user created successfully!');
      console.log('User ID:', data.localId);
      console.log('\n📌 Login credentials:');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('\n🔗 Access the app at: http://localhost:3002/login');
    } else {
      if (data.error && data.error.message === 'EMAIL_EXISTS') {
        console.log('\n✅ Admin user already exists!');
        console.log('\n📌 Login credentials:');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('\n🔗 Access the app at: http://localhost:3002/login');
      } else {
        console.error('Error:', data.error?.message || 'Unknown error');
      }
    }
  } catch (error) {
    console.error('Failed to create admin user:', error);
  }
}

createAdminUser();