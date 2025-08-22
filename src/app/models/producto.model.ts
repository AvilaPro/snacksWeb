export interface Producto {
  id: number;
  nombre: string;
  categoria: 'Snack Salado' | 'Snack Dulce' | 'Bebida Fría' | 'Bebida Caliente' | 'Fruta' | 'Postre' | 'Comida Principal' | 'Ensalada' | 'Sandwich' | 'Pizza' | 'Helado' | 'Galletas' | 'Chocolates' | 'Jugos Naturales' | 'Gaseosas';
  disponible: boolean;
  imagen_url?: string;
}

export interface Reunion {
  id: number;
  nombre_reunion: string;
  fecha: string;
  descripcion: string;
}

export interface Asignacion {
  id: number;
  id_reunion: number;
  id_producto: number;
  nombre_amigo: string;
  cantidad: number;
  comentario?: string;
  producto?: Producto;
}