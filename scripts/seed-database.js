const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Mock data since we can't import TypeScript files directly
const brands = [
  { id: 'ford', name: 'Ford', logo: '/logos/ford.png', active: true, order: 1 },
  { id: 'chevrolet', name: 'Chevrolet', logo: '/logos/chevrolet.png', active: true, order: 2 },
  { id: 'volkswagen', name: 'Volkswagen', logo: '/logos/volkswagen.png', active: true, order: 3 },
  { id: 'fiat', name: 'Fiat', logo: '/logos/fiat.png', active: true, order: 4 },
  { id: 'honda', name: 'Honda', logo: '/logos/honda.png', active: true, order: 5 },
  { id: 'toyota', name: 'Toyota', logo: '/logos/toyota.png', active: true, order: 6 },
  { id: 'hyundai', name: 'Hyundai', logo: '/logos/hyundai.png', active: true, order: 7 },
  { id: 'nissan', name: 'Nissan', logo: '/logos/nissan.png', active: true, order: 8 },
];

const models = [
  { id: 'ford-ka', name: 'Ka', brandId: 'ford', brandName: 'Ford', active: true },
  { id: 'ford-fiesta', name: 'Fiesta', brandId: 'ford', brandName: 'Ford', active: true },
  { id: 'chevrolet-onix', name: 'Onix', brandId: 'chevrolet', brandName: 'Chevrolet', active: true },
  { id: 'volkswagen-gol', name: 'Gol', brandId: 'volkswagen', brandName: 'Volkswagen', active: true },
];

const fontMappings = [
  {
    id: 'ford-ka-2008-2014',
    modelId: 'ford-ka',
    modelName: 'Ka',
    fontFileName: 'arial.ttf',
    yearStart: 2008,
    yearEnd: 2014,
    settings: { fontSize: 12, spacing: 1.2, offsetX: 0, offsetY: 0 },
  },
  {
    id: 'chevrolet-onix-2012-2019',
    modelId: 'chevrolet-onix',
    modelName: 'Onix',
    fontFileName: 'times.ttf',
    yearStart: 2012,
    yearEnd: 2019,
    settings: { fontSize: 13, spacing: 1.3, offsetX: 0, offsetY: 0 },
  },
];

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

const db = admin.firestore();

async function seedDatabase() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  try {
    // Seed Brands
    console.log('📝 Inserindo marcas...');
    const brandsCollection = db.collection('brands');
    
    for (const brand of brands) {
      const docRef = brandsCollection.doc(brand.id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        await docRef.set({
          ...brand,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`   ✅ ${brand.name}`);
      } else {
        console.log(`   ⚠️  ${brand.name} já existe`);
      }
    }

    // Seed Models
    console.log('\n🚗 Inserindo modelos...');
    const modelsCollection = db.collection('models');
    
    for (const model of models) {
      const docRef = modelsCollection.doc(model.id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        await docRef.set({
          ...model,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`   ✅ ${model.brandName} ${model.name}`);
      } else {
        console.log(`   ⚠️  ${model.brandName} ${model.name} já existe`);
      }
    }

    // Seed Font Mappings
    console.log('\n📝 Inserindo mapeamentos de fonte...');
    const fontMappingsCollection = db.collection('fontMappings');
    
    for (const mapping of fontMappings) {
      const docRef = fontMappingsCollection.doc(mapping.id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        await docRef.set({
          ...mapping,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`   ✅ ${mapping.modelName} (${mapping.yearStart}-${mapping.yearEnd})`);
      } else {
        console.log(`   ⚠️  ${mapping.modelName} (${mapping.yearStart}-${mapping.yearEnd}) já existe`);
      }
    }

    console.log('\n🎉 Seed do banco de dados concluído com sucesso!');
    console.log(`\n📊 Resumo:`);
    console.log(`   • ${brands.length} marcas`);
    console.log(`   • ${models.length} modelos`);
    console.log(`   • ${fontMappings.length} mapeamentos de fonte`);

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  }
}

seedDatabase();