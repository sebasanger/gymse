import { Categoria } from '../categoria/categoria.interface';
import { Foto } from '../foto/foto.interface';
import { Video } from '../video/video.interface';

export interface Ejercicio {
  id: number;
  nombre: string;
  descripcion: string;
  deleted: boolean;
  categoria: Categoria;
  fotos?: Foto[];
  videos?: Video[];
}
