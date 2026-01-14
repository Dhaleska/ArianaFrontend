
export interface Cliente {
  clienteId: number;
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  nombreComercial?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  contactoNombre?: string;
  contactoTelefono?: string;
  contactoEmail?: string;
  observaciones?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  estado?: boolean;
}

export interface ClienteRequest {
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  nombreComercial?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  contactoNombre?: string;
  contactoTelefono?: string;
  contactoEmail?: string;
  observaciones?: string;
}