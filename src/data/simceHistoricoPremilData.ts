// ===================================================================
// DATOS OFICIALES SIMCE — AGENCIA DE CALIDAD DE LA EDUCACIÓN
// Escuela Premilitar Héroes de la Concepción (RBD 31030-1)
// Prueba: Lengua y Literatura: Lectura | Nivel: II Medio
// Fuente: Agencia de Calidad de la Educación (2016 – 2025)
// ===================================================================

export interface SimcePremilTendenciaGSE {
  anio: number;
  gse: string;
  puntajeColegio: number;
  puntajeNacionalGSE: number;
  diferencia: number;
}

export interface SimcePremilNivelesAprendizaje {
  anio: number;
  adecuado: number;
  elemental: number;
  insuficiente: number;
  nota?: string;
}

export interface SimcePremilPuntajeSexo {
  anio: number;
  mujeres: number;
  hombres: number;
  brechaSexo: number;
  significativoMujeres?: boolean;
}

export interface SimcePremilResultado2025 {
  puntajeColegio: number;
  puntajeNacionalGSE: number;
  diferenciaVsGSE: number;
  diferenciaVsDependencia: number;
  diferenciaVsNacional: number;
}

export const SIMCE_PREMIL_ESTABLECIMIENTO = {
  nombre: 'Escuela Premilitar Héroes de la Concepción',
  rbd: '31030-1',
  fuente: 'Agencia de Calidad de la Educación',
  prueba: 'Simce',
  asignatura: 'Lengua y Literatura: Lectura',
  nivel: 'II Medio',
  anioMedicion: 2025,
};

export const SIMCE_PREMIL_RESULTADO_2025: SimcePremilResultado2025 = {
  puntajeColegio: 219,
  puntajeNacionalGSE: 240,
  diferenciaVsGSE: -21,
  diferenciaVsDependencia: -32,
  diferenciaVsNacional: -31,
};

export const SIMCE_PREMIL_TENDENCIA_GSE: SimcePremilTendenciaGSE[] = [
  { anio: 2016, gse: 'Medio bajo', puntajeColegio: 241, puntajeNacionalGSE: 236, diferencia: 5 },
  { anio: 2017, gse: 'Medio bajo', puntajeColegio: 240, puntajeNacionalGSE: 242, diferencia: -2 },
  { anio: 2018, gse: 'Medio bajo', puntajeColegio: 227, puntajeNacionalGSE: 243, diferencia: -16 },
  { anio: 2022, gse: 'Medio bajo', puntajeColegio: 194, puntajeNacionalGSE: 234, diferencia: -40 },
  { anio: 2023, gse: 'Medio bajo', puntajeColegio: 212, puntajeNacionalGSE: 240, diferencia: -28 },
  { anio: 2024, gse: 'Medio bajo', puntajeColegio: 217, puntajeNacionalGSE: 241, diferencia: -24 },
  { anio: 2025, gse: 'Medio bajo', puntajeColegio: 219, puntajeNacionalGSE: 240, diferencia: -21 },
];

export const SIMCE_PREMIL_NIVELES: SimcePremilNivelesAprendizaje[] = [
  { anio: 2016, adecuado: 11.1, elemental: 27.8, insuficiente: 61.1 },
  { anio: 2017, adecuado: 9.1,  elemental: 31.8, insuficiente: 59.1 },
  { anio: 2018, adecuado: 5.6,  elemental: 27.1, insuficiente: 67.2 },
  { anio: 2022, adecuado: 2.4,  elemental: 13.8, insuficiente: 83.7, nota: 'Dato con restricción estadística (*)' },
  { anio: 2023, adecuado: 0.7,  elemental: 18.3, insuficiente: 81.0 },
  { anio: 2024, adecuado: 4.0,  elemental: 20.6, insuficiente: 75.4 },
  { anio: 2025, adecuado: 4.3,  elemental: 23.8, insuficiente: 72.0 },
];

export const SIMCE_PREMIL_SEXO: SimcePremilPuntajeSexo[] = [
  { anio: 2016, mujeres: 239, hombres: 243, brechaSexo: -4 },
  { anio: 2017, mujeres: 252, hombres: 232, brechaSexo: 20, significativoMujeres: true },
  { anio: 2018, mujeres: 241, hombres: 219, brechaSexo: 22, significativoMujeres: true },
  { anio: 2022, mujeres: 203, hombres: 190, brechaSexo: 13 },
  { anio: 2023, mujeres: 212, hombres: 212, brechaSexo: 0 },
  { anio: 2024, mujeres: 225, hombres: 213, brechaSexo: 12, significativoMujeres: true },
  { anio: 2025, mujeres: 230, hombres: 213, brechaSexo: 17, significativoMujeres: true },
];
