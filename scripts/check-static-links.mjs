import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicHtml = ['index.html', 'legislacao.html'];
const errors = [];

function fail(message) {
  errors.push(message);
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function idsOf(html) {
  return new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]));
}

const htmlCache = new Map(publicHtml.map((file) => [file, read(file)]));
const idsCache = new Map([...htmlCache].map(([file, html]) => [file, idsOf(html)]));

for (const [file, html] of htmlCache) {
  const forbidden = [
    ['wa.me/', 'ligação direta para WhatsApp'],
    ['mailto:', 'ligação direta para e-mail'],
    ['ctcontabilidadeegestao@gmail.com', 'endereço privado de e-mail'],
    ['928207611', 'número de contacto privado'],
    ['internal/', 'referência à área interna'],
  ];

  for (const [needle, label] of forbidden) {
    if (html.toLowerCase().includes(needle.toLowerCase())) {
      fail(`${file}: contém ${label} (${needle}) no HTML público.`);
    }
  }

  const refs = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map((match) => match[1]);

  for (const ref of refs) {
    if (/^(https?:|data:|javascript:|tel:)/i.test(ref)) continue;

    if (ref.startsWith('#')) {
      const id = ref.slice(1);
      if (id && !idsCache.get(file).has(id)) fail(`${file}: âncora inexistente ${ref}`);
      continue;
    }

    const [targetPathRaw, hash] = ref.split('#');
    const targetPath = targetPathRaw || file;
    const resolved = path.normalize(path.join(path.dirname(file), targetPath));

    if (!fs.existsSync(path.join(root, resolved))) {
      fail(`${file}: ficheiro interno inexistente ${ref}`);
      continue;
    }

    if (hash && resolved.endsWith('.html')) {
      const targetHtml = htmlCache.get(resolved) ?? read(resolved);
      const targetIds = idsCache.get(resolved) ?? idsOf(targetHtml);
      if (!targetIds.has(hash)) fail(`${file}: âncora inexistente ${ref}`);
    }
  }
}

const internalFile = 'internal/ficha-cliente.html';
if (!fs.existsSync(path.join(root, internalFile))) {
  fail(`${internalFile}: protótipo interno em falta.`);
} else {
  const internalHtml = read(internalFile);
  if (!/<meta\s+name=["']robots["']\s+content=["']noindex,nofollow["']/i.test(internalHtml)) {
    fail(`${internalFile}: deve declarar noindex,nofollow.`);
  }
  if (/<input[^>]+type=["']password["']/i.test(internalHtml)) {
    fail(`${internalFile}: não pode conter campos de password.`);
  }
}

const pagesWorkflow = read('.github/workflows/pages.yml');
if (/\bcp\b[^\n]*\binternal\b/i.test(pagesWorkflow) || /_site\/internal/i.test(pagesWorkflow)) {
  fail('.github/workflows/pages.yml: a área internal/ não pode ser copiada para o GitHub Pages.');
}

if (errors.length) {
  console.error('Falhas encontradas:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validação concluída: ${publicHtml.length} páginas públicas verificadas, área interna excluída e sem contactos diretos expostos.`);
