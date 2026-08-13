import { UserProfile } from '../types';

export interface CSVAlumno {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  curso: string;
}

/**
 * Parse a CSV string with headers: rut,nombre,apellido,email,curso
 * Returns an array of parsed rows and an array of error messages.
 */
export function parseAlumnosCSV(raw: string): { rows: CSVAlumno[]; errors: string[] } {
  const lines = raw.trim().split('\n').map(l => l.trim()).filter(Boolean);
  const errors: string[] = [];
  const rows: CSVAlumno[] = [];

  if (lines.length < 2) {
    return { rows: [], errors: ['El archivo no tiene datos o está vacío.'] };
  }

  // Detect separator
  const sep = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(sep).map(h => h.trim().toLowerCase());
  const required = ['rut', 'nombre', 'apellido', 'email', 'curso'];
  const missing = required.filter(r => !headers.includes(r));
  if (missing.length > 0) {
    return { rows: [], errors: [`Columnas faltantes en el CSV: ${missing.join(', ')}`] };
  }

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(sep).map(c => c.trim());
    const row: Partial<CSVAlumno> = {};
    headers.forEach((h, idx) => {
      (row as any)[h] = cols[idx] || '';
    });

    if (!row.rut || !row.nombre || !row.apellido || !row.email) {
      errors.push(`Fila ${i + 1}: Faltan campos obligatorios (rut, nombre, apellido, email).`);
      continue;
    }
    rows.push(row as CSVAlumno);
  }

  return { rows, errors };
}

export function csvAlumnosToProfiles(rows: CSVAlumno[]): UserProfile[] {
  return rows.map((r, idx) => ({
    id: `alumno-csv-${Date.now()}-${idx}`,
    rut: r.rut,
    nombre: r.nombre,
    apellido: r.apellido,
    email: r.email,
    rol: 'alumno',
    establecimiento: 'Escuela Bicentenario Demo',
  }));
}
