export type TipoMaterial = 'pdf' | 'ppt' | 'video' | 'ejercicio';

export type AsignaturaBiblioteca =
  | 'matematica'
  | 'lenguaje'
  | 'historia'
  | 'biologia'
  | 'fisica'
  | 'quimica'
  | 'tp';

export interface MaterialEstudio {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: TipoMaterial;
  asignatura: AsignaturaBiblioteca;
  eje: string;
  url: string;
  fuente?: string;
}

export interface ModalVisorData {
  titulo: string;
  embedUrl: string;
  externalUrl?: string;
  tipo: TipoMaterial | 'drive_folder';
}

