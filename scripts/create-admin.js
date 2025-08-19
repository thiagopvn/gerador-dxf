const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const auth = admin.auth();
const db = admin.firestore();

async function createAdmin() {
  const email = 'admin@remarcacao.com';
  const password = 'Admin@2024!';

  try {
    console.log('🔄 Criando usuário administrador...');
    
    // Try to get user first
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log('ℹ️  Usuário já existe, atualizando...');
    } catch (error) {
      // User doesn't exist, create new one
      userRecord = await auth.createUser({
        email: email,
        password: password,
        emailVerified: true,
      });
      console.log('✅ Usuário criado com sucesso!');
    }

    // Set custom claims for admin role
    await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });
    console.log('✅ Role de administrador configurada!');

    // Add to Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('✅ Usuário salvo no Firestore!');

    console.log('\n🎉 Administrador criado com sucesso!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Senha: ${password}`);
    
  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error);
  }
}

createAdmin();