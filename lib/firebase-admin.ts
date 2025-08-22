import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || 'remarcacao-chassi',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-3w8uu@remarcacao-chassi.iam.gserviceaccount.com',
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDO3KLqRdJvD5n8\nq7jBcJ9mqhOQNy7kZLnPGwHCy/T3GCLFaavJWZlN5vGAjbJ2/HQu8YXoN6HfUaVo\nvKgDc/+JJ7XHBrKBvRWJjghhUNJqO/uJWPLqLqB2yHwHr2u+pJPO4LSMoNbKKNXu\nLFy8V2zNJMzM/9NGQSM5Xl8H4wcYsAz5syUHTdmzqJXD+83YJGJJazOQQyiJNlHD\nfJvRqOF5aV0B5TVKpWBhRiEZ0yLEH3g6KTZJ2Yzf1T2JhS/Xj7ByHdPGqSJ3cPhV\nHQ8mDlKCxSdcXo9CWDzCgx+EVxGJT7rEIdKLW4Vu6gJwihP70MK9A5F8SZ5J3ZD5\nifOMb5djAgMBAAECggEAJ8YD9uOXCT7MKhU/qZhsRWJJnqxcHjP5Yf6Z2GH4HJYV\nX+LlrgApcawcIvU4YeCYKcpzfMYFYi35vJq3XfJOLnLRgvqPhW1fLpQoGBP5RoKS\noKh9sNyPxo1I7y6X8FxrPGjSZQgJAOA0RhU1FPJjCF2BIjqQ0FLqmhweey0mOlwZ\n8qX6aYVOJQNLJ8MQSCy/9kCy8YFIz7jO5SCq1gRKVGjFXcYGGDbLQq0Q5oRx+MBV\njnquUnXy3hX+cXo8Cq+KOD9Q3s6Fk0OZHvRk4hOPvBJb0YG+eP9c/7zx3RTBShLu\neCSzQ7vXJ0z/XKpbjRBp5DF1kKb7vdGhGxhTgOXa8QKBgQDqjKyAVJozCRAOxxF5\nvNrT7mQhRy4sJPxnQYNGGOOqM7yYb6p3x7H/3XHgJHWh3Fhzw5vJ+Jg7ZwRBKFxg\nXc1gN0vhELPx0w7r7pNJCCNRiPuUxJBm4JfNvHQqRUOqU1NlOdLw8VTJzrw/j/iR\nIdjXfLrnJlH3JyP6oKNQUFR3qQKBgQDh5SRKJozgXhxIxBNmRJWxQGOiFQg2cLmJ\nvjfwOqQVMkwvFZ/nA7y8ZL/b0yy1UeI7OVWW9SU/hj8g9uVUMm5BJEQ6zWg3IQ9k\nZZANlH0Y8wNHULvYqt/EqL+lTPfazON0vvnPgORAiOy3WNgf8Aw/a2FQjlGx9CEq\nJLxyGf1JawKBgDdJQxiQeNTfhQpQ3Y7gIMWRxJxYcb0NmHJNmW3UiKQZ+hWojBpK\nBnxCu1q5G1z1wH7qjOhVvHOGdCbQcJCQnkBN8SXsJhNzPnTnz2qQbfwCJ6k5LWsB\n5qOiCjhqb5sMN/llCJLsrNRWVvJ2u8dCrPP0QMN3vBhPx+pQUwCCLJQRAoGAHJzr\nYzD4YUOOQPv0AhqhENcywBL7aJBWXJ9VK3cBjqzGIoGv1qdVpNT6yiY3tZQhyXmA\nwJXSLETHjSy3Q9bgELXf2+o8T2V5Z+YKsQJRrX0yAzQQgMNLgz1V3Hfk1yJxo8KN\nqvgIzgJdCJ5GUpIqOPm4l0/ovJNcnJRE8pn5bZMCgYEArfJNP/vzSrIxCaFGJhBe\nb2iQwQOOvKCJcQODRyNx8oRq8pAIJP7IXgDBgcAEzBZT5jC4ov/b9QsWUdpphMzS\nHQJV6s6mVDTvHUHQ0p7AqSgz2A7sP+L0kzNBHKlLNNuFJnUGc0C3vL3IyqHwtJdG\ng9Zro5K9nLjJNFXD8M/TGzA=\n-----END PRIVATE KEY-----').replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.stack);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();