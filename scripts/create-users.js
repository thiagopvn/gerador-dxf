import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

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

async function createUser(email, password, role, displayName) {
  try {
    console.log(`🔄 Criando usuário ${role}: ${email}...`);
    
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log(`ℹ️  Usuário ${email} já existe, atualizando...`);
      
      // Update existing user
      await auth.updateUser(userRecord.uid, {
        password: password,
        emailVerified: true,
        displayName: displayName,
      });
    } catch (error) {
      // User doesn't exist, create new one
      userRecord = await auth.createUser({
        email: email,
        password: password,
        emailVerified: true,
        displayName: displayName,
      });
      console.log(`✅ Usuário ${email} criado com sucesso!`);
    }

    // Set custom claims for role
    await auth.setCustomUserClaims(userRecord.uid, { role: role });
    console.log(`✅ Role '${role}' configurada para ${email}!`);

    // Add to Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      role: role,
      displayName: displayName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: null,
    }, { merge: true });
    console.log(`✅ Usuário ${email} salvo no Firestore!`);

    return { email, password, role, uid: userRecord.uid };
    
  } catch (error) {
    console.error(`❌ Erro ao criar usuário ${email}:`, error);
    throw error;
  }
}

async function createAllUsers() {
  console.log('👥 Criando perfis de usuários...\n');

  const users = [
    {
      email: 'admin@remarcacao.com',
      password: 'Admin@2024!',
      role: 'admin',
      displayName: 'Administrador Sistema'
    },
    {
      email: 'user@remarcacao.com',
      password: 'User@2024!',
      role: 'user',
      displayName: 'Usuário Padrão'
    },
    {
      email: 'teste@remarcacao.com',
      password: 'Teste@2024!',
      role: 'user',
      displayName: 'Usuário Teste'
    }
  ];

  const createdUsers = [];

  for (const userData of users) {
    try {
      const user = await createUser(
        userData.email, 
        userData.password, 
        userData.role, 
        userData.displayName
      );
      createdUsers.push(user);
      console.log(''); // Add spacing
    } catch (error) {
      console.error(`Falha ao criar ${userData.email}`);
    }
  }

  console.log('\n🎉 Criação de usuários concluída!\n');
  console.log('📋 CREDENCIAIS DE ACESSO:');
  console.log('=' .repeat(50));
  
  createdUsers.forEach(user => {
    console.log(`\n👤 ${user.role.toUpperCase()}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   🔑 Senha: ${user.password}`);
    console.log(`   🎭 Role: ${user.role}`);
  });

  console.log('\n' + '=' .repeat(50));
  console.log('✨ Use essas credenciais para testar o sistema!');
}

createAllUsers();