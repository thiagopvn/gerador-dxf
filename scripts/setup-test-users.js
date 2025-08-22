// Script para configurar usuários de teste via Firebase Client SDK
// Este script criará os dados necessários sem usar Admin SDK

const testUsers = [
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

const brands = [
  { id: 'ford', name: 'Ford', active: true, order: 1 },
  { id: 'chevrolet', name: 'Chevrolet', active: true, order: 2 },
  { id: 'volkswagen', name: 'Volkswagen', active: true, order: 3 },
  { id: 'fiat', name: 'Fiat', active: true, order: 4 },
  { id: 'honda', name: 'Honda', active: true, order: 5 },
  { id: 'toyota', name: 'Toyota', active: true, order: 6 },
  { id: 'hyundai', name: 'Hyundai', active: true, order: 7 },
  { id: 'nissan', name: 'Nissan', active: true, order: 8 },
];

const models = [
  { id: 'ford-ka', name: 'Ka', brandId: 'ford', brandName: 'Ford', active: true },
  { id: 'ford-fiesta', name: 'Fiesta', brandId: 'ford', brandName: 'Ford', active: true },
  { id: 'chevrolet-onix', name: 'Onix', brandId: 'chevrolet', brandName: 'Chevrolet', active: true },
  { id: 'chevrolet-prisma', name: 'Prisma', brandId: 'chevrolet', brandName: 'Chevrolet', active: true },
  { id: 'chevrolet-cruze', name: 'Cruze', brandId: 'chevrolet', brandName: 'Chevrolet', active: true },
  { id: 'volkswagen-gol', name: 'Gol', brandId: 'volkswagen', brandName: 'Volkswagen', active: true },
  { id: 'fiat-uno', name: 'Uno', brandId: 'fiat', brandName: 'Fiat', active: true },
];

console.log('🔧 CONFIGURAÇÃO MANUAL DE USUÁRIOS DE TESTE');
console.log('=' .repeat(60));

console.log('\n📋 USUÁRIOS PARA CRIAR NO FIREBASE CONSOLE:');
console.log('(Acesse: https://console.firebase.google.com/project/remarcacao-chassi/authentication/users)');

testUsers.forEach((user, index) => {
  console.log(`\n${index + 1}. ${user.role.toUpperCase()}`);
  console.log(`   📧 Email: ${user.email}`);
  console.log(`   🔑 Senha: ${user.password}`);
  console.log(`   🎭 Role: ${user.role}`);
  console.log(`   👤 Nome: ${user.displayName}`);
});

console.log('\n📊 DADOS PARA FIRESTORE:');
console.log('(Cole no Firestore Database)');

console.log('\n🏷️  Collection: brands');
brands.forEach(brand => {
  console.log(`   Document ID: ${brand.id}`);
  console.log(`   Data: ${JSON.stringify(brand, null, 2)}`);
});

console.log('\n🚗 Collection: models');
models.forEach(model => {
  console.log(`   Document ID: ${model.id}`);
  console.log(`   Data: ${JSON.stringify(model, null, 2)}`);
});

console.log('\n' + '=' .repeat(60));
console.log('✨ INSTRUÇÕES:');
console.log('1. Acesse o Firebase Console do seu projeto');
console.log('2. Vá em Authentication > Users');
console.log('3. Crie os usuários com as credenciais acima');
console.log('4. Vá em Firestore > Data');
console.log('5. Crie as collections brands e models com os dados');
console.log('6. Teste o login na aplicação!');
console.log('\n🌐 Aplicação: http://localhost:3000/login');