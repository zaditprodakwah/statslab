const fs = require('fs');
const path = require('path');

const libPrismaContent = `import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
`;

const prismaLibPath = path.join(__dirname, 'apps/web/src/lib/prisma.ts');
if (!fs.existsSync(path.dirname(prismaLibPath))) {
  fs.mkdirSync(path.dirname(prismaLibPath), { recursive: true });
}
fs.writeFileSync(prismaLibPath, libPrismaContent);
console.log("Created lib/prisma.ts");

const replaceInFile = (file, replacements) => {
  const fullPath = path.join(__dirname, 'apps/web/src', file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  let originalContent = content;
  for (const { search, replace } of replacements) {
    if (typeof search === 'string') {
      content = content.split(search).join(replace);
    } else {
      content = content.replace(search, replace);
    }
  }
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  }
};

const routeFiles = [
  'app/api/task-responses/route.ts',
  'app/api/datasets/route.ts',
  'app/api/admin/auth/route.ts',
  'app/api/admin/datasets/route.ts',
  'app/api/admin/sessions/route.ts',
  'app/api/leaderboard/route.ts',
  'app/api/sessions/route.ts',
  'app/api/export/cfa/route.ts',
  'app/api/export/rasch/route.ts'
];

routeFiles.forEach(file => {
  replaceInFile(file, [
    { search: 'import { PrismaClient } from "@prisma/client";', replace: 'import { prisma } from "@/lib/prisma";' },
    { search: 'let prisma: PrismaClient;', replace: '' },
    { search: '  if (!prisma) {\n    prisma = new PrismaClient();\n  }', replace: '' },
    { search: '  if (!prisma) prisma = new PrismaClient();', replace: '' },
    { search: '    prisma = new PrismaClient();', replace: '' },
    { search: '  if (!prisma) {\n        prisma = new PrismaClient();\n    }', replace: '' }
  ]);
});

// Special case for api/sus/route.ts
replaceInFile('app/api/sus/route.ts', [
  { search: 'import { PrismaClient } from "@prisma/client";', replace: 'import { prisma } from "@/lib/prisma";' },
  { search: 'import { PrismaPg } from "@prisma/adapter-pg";\nimport { Pool } from "pg";\n\nconst connectionString = process.env.DATABASE_URL;\nconst pool = new Pool({ connectionString });\nconst adapter = new PrismaPg(pool);\nconst prisma = new PrismaClient({ adapter });', replace: '' },
  { search: 'import { PrismaPg } from "@prisma/adapter-pg";\nimport { Pool } from "pg";', replace: '' }
]);

console.log("Prisma singleton refactor done");
