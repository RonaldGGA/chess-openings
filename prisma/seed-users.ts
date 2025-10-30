// prisma/seed.ts
import { PrismaClient } from '@/app/generated/prisma/client';

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de base de datos...')

  // Limpiar datos existentes (opcional - solo para desarrollo)
  console.log('🧹 Limpiando datos existentes...')
  await prisma.userFavorite.deleteMany()
  await prisma.openingVisit.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Crear usuarios de prueba
  console.log('👤 Creando usuarios de prueba...')

  const user1 = await prisma.user.create({
    data: {
      name: 'Carlos Martínez',
      email: 'carlos.martinez@email.com',
      emailVerified: new Date(),
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      password: '$2b$10$EXAMPLE_HASHED_PASSWORD_123', // En producción, usa bcrypt
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@email.com',
      emailVerified: new Date(),
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      password: '$2b$10$EXAMPLE_HASHED_PASSWORD_456',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      name: 'David Chen',
      email: 'david.chen@email.com',
      emailVerified: new Date(),
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      password: '$2b$10$EXAMPLE_HASHED_PASSWORD_789',
    },
  })

  console.log('✅ Usuarios creados:')
  console.log(`   👤 ${user1.name} - ${user1.email}`)
  console.log(`   👤 ${user2.name} - ${user2.email}`)
  console.log(`   👤 ${user3.name} - ${user3.email}`)

  // Crear algunos openings básicos para poder hacer favoritos y visitas
  console.log('♟️ Creando openings de ejemplo...')

  const opening1 = await prisma.opening.create({
    data: {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      src: 'traditional',
      eco: 'A00',
      moves: 'e4 e5 Nf3 Nc6 Bb5',
      name: 'Apertura Española',
      isEcoRoot: true,
    },
  })

  const opening2 = await prisma.opening.create({
    data: {
      fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
      src: 'traditional',
      eco: 'B20',
      moves: 'e4 c5 Nf3 d6 d4',
      name: 'Defensa Siciliana',
      isEcoRoot: true,
    },
  })

  const opening3 = await prisma.opening.create({
    data: {
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
      src: 'traditional',
      eco: 'C60',
      moves: 'e4 e5 Nf3 Nc6 Bb5',
      name: 'Apertura Italiana',
      isEcoRoot: false,
    },
  })

  // Crear algunos favoritos de ejemplo
  console.log('❤️ Creando favoritos de ejemplo...')

  await prisma.userFavorite.create({
    data: {
      userId: user1.id,
      openingId: opening1.id,
    },
  })

  await prisma.userFavorite.create({
    data: {
      userId: user1.id,
      openingId: opening2.id,
    },
  })

  await prisma.userFavorite.create({
    data: {
      userId: user2.id,
      openingId: opening2.id,
    },
  })

  // Crear visitas de ejemplo
  console.log('📊 Creando historial de visitas...')

  // Carlos visita la Española 3 veces y la Siciliana 1 vez
  await prisma.openingVisit.create({
    data: {
      userId: user1.id,
      openingId: opening1.id,
      count: 3,
      visitedAt: new Date('2024-01-15'),
    },
  })

  await prisma.openingVisit.create({
    data: {
      userId: user1.id,
      openingId: opening2.id,
      count: 1,
      visitedAt: new Date('2024-01-16'),
    },
  })

  // Ana visita la Siciliana 2 veces
  await prisma.openingVisit.create({
    data: {
      userId: user2.id,
      openingId: opening2.id,
      count: 2,
      visitedAt: new Date('2024-01-14'),
    },
  })

  // David visita la Italiana 1 vez
  await prisma.openingVisit.create({
    data: {
      userId: user3.id,
      openingId: opening3.id,
      count: 1,
      visitedAt: new Date('2024-01-13'),
    },
  })

  console.log('🎉 Seed completado exitosamente!')
  console.log('')
  console.log('📊 Resumen de datos creados:')
  console.log('   👥 3 usuarios')
  console.log('   ♟️ 3 openings')
  console.log('   ❤️ 3 favoritos')
  console.log('   📈 4 registros de visitas')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })