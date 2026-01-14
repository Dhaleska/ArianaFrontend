import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cargo, CargoRequest } from '../models/cargo.model';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  // URL del microservicio RRHH (pasa por el gateway)
  private apiUrl = 'http://localhost:9082/api/cargo';

  constructor(private http: HttpClient) {}

  // Headers con token JWT
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener todos los cargos
  getAllCargos(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // Obtener cargos con cantidad de personal
  getCargosWithPersonalCount(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(`${this.apiUrl}/con-personal`, {
      headers: this.getHeaders()
    });
  }

  // Obtener cargo por ID
  getCargoById(id: number): Observable<Cargo> {
    return this.http.get<Cargo>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Crear nuevo cargo
  createCargo(cargo: CargoRequest): Observable<Cargo> {
    return this.http.post<Cargo>(this.apiUrl, cargo, {
      headers: this.getHeaders()
    });
  }

  // Actualizar cargo
  updateCargo(id: number, cargo: CargoRequest): Observable<Cargo> {
    return this.http.put<Cargo>(`${this.apiUrl}/${id}`, cargo, {
      headers: this.getHeaders()
    });
  }

  // Eliminar cargo (eliminación lógica)
  deleteCargo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}