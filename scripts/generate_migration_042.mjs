import fs from 'fs';

function cleanSymbolFont(text) {
  if (!text) return text;
  return text
    .replace(/[\uF028\uF0E6\uF0E7\uF0E8]/g, '(')
    .replace(/[\uF029\uF0F6\uF0F7\uF0F8]/g, ')')
    .replace(/\uF02B/g, '+')
    .replace(/[\uF02D\u2013\u2014]/g, '-')
    .replace(/\uF03D/g, '=')
    .replace(/\uF05B/g, '[')
    .replace(/\uF05D/g, ']')
    .replace(/\uF070/g, 'π')
    .replace(/\uF0B3/g, '≥')
    .replace(/\uF0A3/g, '≤')
    .replace(/\uF0B9/g, '≠')
    .replace(/[\uF0B7\uF0D7]/g, '·')
    .replace(/\s*\s*2023/g, '')
    .replace(/\s*-\s*2023/g, '');
}

const sql040 = fs.readFileSync('supabase/migrations/040_sanitize_all_65_paes_mat1_2023.sql', 'utf8');

const header = '-- ====================================================================\n' +
  '-- MIGRATION 042: Saneamiento Global de Simbolos Symbol Font (PUA) y Marcas\n' +
  '-- Sanea 42 preguntas de PAES M1 2023 con caracteres no estandar (U+F000-U+F0FF)\n' +
  '-- ====================================================================\n\n';

const regex = /-- Pregunta \d+[\s\S]*?WHERE id = '[^']+';/g;
let m;
const updates = [];

while ((m = regex.exec(sql040)) !== null) {
  const originalBlock = m[0];
  if (/[\uF000-\uF0FF]/.test(originalBlock)) {
    updates.push(cleanSymbolFont(originalBlock));
  }
}

console.log('Bloques a actualizar en 042:', updates.length);
const finalMigration = header + updates.join('\n\n') + '\n';
fs.writeFileSync('supabase/migrations/042_sanitize_all_symbol_pua_chars.sql', finalMigration, 'utf8');
console.log('Migracion 042 generada con exito.');
