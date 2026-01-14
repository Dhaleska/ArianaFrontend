// src/app/modules/personal/models/personal.model.ts

export interface Personal {
  personalId: number;
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  fechaNacimiento?: string;
  fechaIngreso?: string;
  cargoId: number;
  foto?: string;
  supervisorId?: number;  // NUEVO
  fechaCreacion?: string;
  fechaModificacion?: string;
  estado?: boolean;
  // Datos del cargo (JOIN)
  nombreCargo?: string;
  descripcionCargo?: string;
  sueldo?: number;
  // Datos del supervisor (JOIN) - NUEVO
  supervisor?: SupervisorInfo;
  // Computed
  nombreCompleto?: string;
}

export interface SupervisorInfo {
  supervisorId: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  nombreCompleto: string;
}

export interface PersonalRequest {
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  fechaNacimiento?: string;
  cargoId: number;
  supervisorId?: number;
}