export type TipoDocumentoDemre = 'prueba' | 'clavijero' | 'temario' | 'revista';

export type MateriaDemre =
  | 'm1'
  | 'm2'
  | 'matematica'
  | 'lectora'
  | 'historia'
  | 'biologia'
  | 'quimica'
  | 'fisica'
  | 'tp'
  | 'ciencias'
  | 'desconocida';

export interface DocumentoDemre {
  url: string;
  archivo: string;
  anio: number;
  tipo: TipoDocumentoDemre;
  materia: MateriaDemre;
}

export interface ModalVisorDemreData {
  titulo: string;
  url: string;
  tipo: TipoDocumentoDemre;
  anio: number;
  materia: string;
}

