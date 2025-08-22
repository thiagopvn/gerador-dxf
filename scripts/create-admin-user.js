const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'remarcacao-chassi',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-3w8uu@remarcacao-chassi.iam.gserviceaccount.com',
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDO3KLqRdJvD5n8
q7jBcJ9mqhOQNy7kZLnPGwHCy/T3GCLFaavJWZlN5vGAjbJ2/HQu8YXoN6HfUaVo
vKgDc/+JJ7XHBrKBvRWJjghhUNJqO/uJWPLqLqB2yHwHr2u+pJPO4LSMoNbKKNXu
LFy8V2zNJMzM/9NGQSM5Xl8H4wcYsAz5syUHTdmzqJXD+83YJGJJazOQQyiJNlHD
fJvRqOF5aV0B5TVKpWBhRiEZ0yLEH3g6KTZJ2Yzf1T2JhS/Xj7ByHdPGqSJ3cPhV
HQ8mDlKCxSdcXo9CWDzCgx+EVxGJT7rEIdKLW4Vu6gJwihP70MK9A5F8SZ5J3ZD5
ifOMb5djAgMBAAECggEAJ8YD9uOXCT7MKhU/qZhsRWJJnqxcHjP5Yf6Z2GH4HJYV
X+LlrgApcawcIvU4YeCYKcpzfMYFYi35vJq3XfJOLnLRgvqPhW1fLpQoGBP5RoKS
oKh9sNyPxo1I7y6X8FxrPGjSZQgJAOA0RhU1FPJjCF2BIjqQ0FLqmhweey0mOlwZ
8qX6aYVOJQNLJ8MQSCy/9kCy8YFIz7jO5SCq1gRKVGjFXcYGGDbLQq0Q5oRx+MBV
jnquUnXy3hX+cXo8Cq+KOD9Q3s6Fk0OZHvRk4hOPvBJb0YG+eP9c/7zx3RTBShLu
eCSzQ7vXJ0z/XKpbjRBp5DF1kKb7vdGhGxhTgOXa8QKBgQDqjKyAVJozCRAOxxF5
vNrT7mQhRy4sJPxnQYNGGOOqM7yYb6p3x7H/3XHgJHWh3Fhzw5vJ+Jg7ZwRBKFxg
Xc1gN0vhELPx0w7r7pNJCCNRiPuUxJBm4JfNvHQqRUOqU1NlOdLw8VTJzrw/j/iR
IdjXfLrnJlH3JyP6oKNQUFR3qQKBgQDh5SRKJozgXhxIxBNmRJWxQGOiFQg2cLmJ
vjfwOqQVMkwvFZ/nA7y8ZL/b0yy1UeI7OVWW9SU/hj8g9uVUMm5BJEQ6zWg3IQ9k
ZZANlH0Y8wNHULvYqt/EqL+lTPfazON0vvnPgORAiOy3WNgf8Aw/a2FQjlGx9CEq
JLxyGf1JawKBgDdJQxiQeNTfhQpQ3Y7gIMWRxJxYcb0NmHJNmW3UiKQZ+hWojBpK
BnxCu1q5G1z1wH7qjOhVvHOGdCbQcJCQnkBN8SXsJhNzPnTnz2qQbfwCJ6k5LWsB
5qOiCjhqb5sMN/llCJLsrNRWVvJ2u8dCrPP0QMN3vBhPx+pQUwCCLJQRAoGAHJzr
YzD4YUOOQPv0AhqhENcywBL7aJBWXJ9VK3cBjqzGIoGv1qdVpNT6yiY3tZQhyXmA
wJXSLETHjSy3Q9bgELXf2+o8T2V5Z+YKsQJRrX0yAzQQgMNLgz1V3Hfk1yJxo8KN
qvgIzgJdCJ5GUpIqOPm4l0/ovJNcnJRE8pn5bZMCgYEArfJNP/vzSrIxCaFGJhBe
b2iQwQOOvKCJcQODRyNx8oRq8pAIJP7IXgDBgcAEzBZT5jC4ov/b9QsWUdpphMzS
HQJV6s6mVDTvHUHQ0p7AqSgz2A7sP+L0kzNBHKlLNNuFJnUGc0C3vL3IyqHwtJdG
g9Zro5K9nLjJNFXD8M/TGzA=
-----END PRIVATE KEY-----`).replace(/\\n/g, '\n')
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const auth = admin.auth();
const db = admin.firestore();

async function createAdminUser() {
  const email = 'admin@remarcacao.com';
  const password = 'Admin@2024!';
  
  try {
    // Try to get existing user
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log('User already exists:', userRecord.uid);
      
      // Update password
      await auth.updateUser(userRecord.uid, {
        password: password
      });
      console.log('Password updated for existing user');
    } catch (error) {
      // User doesn't exist, create new
      userRecord = await auth.createUser({
        email: email,
        password: password,
        emailVerified: true,
        displayName: 'Administrador'
      });
      console.log('New admin user created:', userRecord.uid);
    }
    
    // Set custom claims for admin
    await auth.setCustomUserClaims(userRecord.uid, { 
      role: 'admin',
      isAdmin: true 
    });
    console.log('Admin claims set successfully');
    
    // Create/update user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email: email,
      name: 'Administrador',
      role: 'admin',
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log('User document created/updated in Firestore');
    
    console.log('\n✅ Admin user setup complete!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('🔗 Login at: http://localhost:3002/login');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
  
  process.exit(0);
}

createAdminUser();