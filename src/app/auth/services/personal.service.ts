// src/app/modules/personal/services/personal.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personal, PersonalRequest } from '../models/personal.model';
import { Cargo } from '../models/cargo.model';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  private apiUrl = 'http://localhost:9082/api/personal';
  private cargoApiUrl = 'http://localhost:9082/api/cargo';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ========== PERSONAL ==========

  getAllPersonal(): Observable<Personal[]> {
    return this.http.get<Personal[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getPersonalById(id: number): Observable<Personal> {
    return this.http.get<Personal>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  getPersonalByDni(dni: string): Observable<Personal> {
    return this.http.get<Personal>(`${this.apiUrl}/dni/${dni}`, {
      headers: this.getHeaders()
    });
  }

  getPersonalByCargo(cargoId: number): Observable<Personal[]> {
    return this.http.get<Personal[]>(`${this.apiUrl}/cargo/${cargoId}`, {
      headers: this.getHeaders()
    });
  }

  // NUEVO: Obtener trabajadores líderes (para select de supervisores)
  getTrabajadoresLideres(): Observable<Personal[]> {
    return this.http.get<Personal[]>(`${this.apiUrl}/trabajadores-lideres`, {
      headers: this.getHeaders()
    });
  }

  // NUEVO: Obtener jefe de sistemas
  getJefeSistemas(): Observable<Personal> {
    return this.http.get<Personal>(`${this.apiUrl}/jefe-sistemas`, {
      headers: this.getHeaders()
    });
  }

  createPersonal(personal: PersonalRequest): Observable<Personal> {
    return this.http.post<Personal>(this.apiUrl, personal, {
      headers: this.getHeaders()
    });
  }

  updatePersonal(id: number, personal: PersonalRequest): Observable<Personal> {
    return this.http.put<Personal>(`${this.apiUrl}/${id}`, personal, {
      headers: this.getHeaders()
    });
  }

  deletePersonal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // ========== CARGOS (para el select) ==========

  getAllCargos(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(this.cargoApiUrl, {
      headers: this.getHeaders()
    });
  }
}