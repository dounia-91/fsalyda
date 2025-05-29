// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// Déclarez une variable globale pour stocker l'instance PrismaClient
// Cela est nécessaire pour éviter la création de multiples instances en développement
// où le hot-reloading de Next.js peut réinitialiser les modules.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

// En production, créez une nouvelle instance de PrismaClient
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // En développement, utilisez l'instance globale pour éviter la réinitialisation
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// Exportez l'instance de Prisma Client pour qu'elle puisse être importée ailleurs
export default prisma;
