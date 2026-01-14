export interface Cargo {
  cargoId: number;
  nombreCargo: string;
  descripcion: string;
  sueldo: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
  estado?: boolean;
  cantidadPersonal?: number;
}

export interface CargoRequest {
  nombreCargo: string;
  descripcion: string;
  sueldo: number;
}