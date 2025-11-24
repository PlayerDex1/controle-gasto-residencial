#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando estrutura do projeto...\n');

const requiredFiles = [
  'app/layout.tsx',
  'app/page.tsx',
  'package.json',
  'next.config.js',
  'tsconfig.json',
  'tailwind.config.ts',
  'prisma/schema.prisma',
];

const requiredDirs = [
  'app',
  'app/api',
  'lib',
  'prisma',
  'public',
];

let hasErrors = false;

// Verificar diretórios
console.log('📁 Verificando diretórios:');
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`  ✅ ${dir}`);
  } else {
    console.log(`  ❌ ${dir} - FALTANDO!`);
    hasErrors = true;
  }
});

console.log('\n📄 Verificando arquivos:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - FALTANDO!`);
    hasErrors = true;
  }
});

// Verificar se app tem conteúdo
console.log('\n📦 Verificando conteúdo do diretório app:');
if (fs.existsSync('app')) {
  const appFiles = fs.readdirSync('app', { recursive: true });
  if (appFiles.length === 0) {
    console.log('  ❌ Diretório app está vazio!');
    hasErrors = true;
  } else {
    console.log(`  ✅ ${appFiles.length} arquivos encontrados`);
  }
}

if (hasErrors) {
  console.log('\n❌ ERROS ENCONTRADOS! Corrija antes de fazer deploy.');
  process.exit(1);
} else {
  console.log('\n✅ Estrutura do projeto está correta!');
  process.exit(0);
}

