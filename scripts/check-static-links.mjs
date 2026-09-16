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

if (errors.length) {
  console.error('Falhas encontradas:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validação concluída: ${publicHtml.length} páginas verificadas, sem ligações internas partidas nem contactos diretos expostos.`);
