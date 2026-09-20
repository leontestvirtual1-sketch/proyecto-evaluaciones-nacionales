import fs from 'fs';

const mat2mJson = JSON.parse(fs.readFileSync('scripts/data/mat2m_e3_preguntas_reales_34.json', 'utf8'));
const mat2mData = mat2mJson.preguntas;

const clavesMat2m = {};
for (const p of mat2mData) {
  clavesMat2m[p.numero] = p.respuesta_correcta;
}

const officialMat2m = {
  evaluacion_id: "eval-simce-mat-2m-e3",
  fuente: "Umáximo — Ensayo 3 SIMCE Matemática 2° Medio",
  sha256_pdf: "BDBBA18F8279ED1E58FBF7BA1F46B1CABB3E5D7FC884E705B5AFF09B4C5D6E63",
  n_preguntas: 34,
  puntaje_esperado: 34,
  claves: clavesMat2m
};

fs.writeFileSync(
  'scripts/data/claves_oficiales/simce_mat_2m_e3.json',
  JSON.stringify(officialMat2m, null, 2),
  'utf8'
);

// 2. PAES Lectora 2026 Forma 101
const paesLectData = JSON.parse(fs.readFileSync('scripts/data/paes_lect_2026_reales_65.json', 'utf8'));

const clavesPaesLect = {};
for (const p of paesLectData) {
  clavesPaesLect[p.numero] = p.respuesta_correcta;
}

const officialPaesLect = {
  evaluacion_id: "eval-paes-lect-2026-f103",
  fuente: "DEMRE — PAES Oficial Competencia Lectora 2026 (Forma 101 Invierno)",
  sha256_pdf: null,
  n_preguntas: 65,
  preguntas_puntuables: 60,
  preguntas_piloto: [10, 22, 23, 52, 58],
  puntaje_esperado: 65,
  claves: clavesPaesLect
};

fs.writeFileSync(
  'scripts/data/claves_oficiales/paes_lectora_2026_f101.json',
  JSON.stringify(officialPaesLect, null, 2),
  'utf8'
);

console.log('✅ Archivos de claves oficiales generados en scripts/data/claves_oficiales/');
