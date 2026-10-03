// Abre o Chrome com um perfil dedicado (.profile/) para você logar UMA vez
// no Instagram, Facebook, LinkedIn e Google. O login fica salvo no perfil e o
// coletar.mjs reutiliza. Feche a janela quando terminar.
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const ctx = await chromium.launchPersistentContext(path.join(dir, '.profile'), {
  channel: 'chrome',
  headless: false,
  viewport: null,
});

const sites = [
  'https://www.instagram.com/accounts/login/',
  'https://www.facebook.com/login/',
  'https://www.linkedin.com/login',
  'https://accounts.google.com/',
];
for (const [i, url] of sites.entries()) {
  const page = i === 0 ? ctx.pages()[0] ?? (await ctx.newPage()) : await ctx.newPage();
  await page.goto(url).catch(() => {});
}
console.log('Faça login nas 4 abas e depois feche o Chrome. O perfil fica salvo em .profile/');
await new Promise((resolve) => ctx.on('close', resolve));
