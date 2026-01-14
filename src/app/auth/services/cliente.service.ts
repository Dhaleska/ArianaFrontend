// src/app/modules/clientes/services/cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, ClienteRequest } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // URL del microservicio RRHH (pasa por el gateway)
  private apiUrl = 'http://localhost:9082/api/cliente';

  constructor(private http: HttpClient) {}

  // Headers con token JWT
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener todos los clientes
  getAllClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // Obtener cliente por ID
  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Obtener cliente por documento
  getClienteByDocumento(numeroDocumento: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/documento/${numeroDocumento}`, {
      headers: this.getHeaders()
    });
  }

  // Crear nuevo cliente
  createCliente(cliente: ClienteRequest): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente, {
      headers: this.getHeaders()
    });
  }

  // Actualizar cliente
  updateCliente(id: number, cliente: ClienteRequest): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente, {
      headers: this.getHeaders()
    });
  }

  // Eliminar cliente (eliminación lógica)
  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}