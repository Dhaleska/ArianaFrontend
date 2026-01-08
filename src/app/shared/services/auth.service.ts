// src/app/shared/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { tap, map, catchError } from 'rxjs/operators';
import { 
  LoginRequest, 
  AuthResponse, 
  ValidateTokenResponse, 
  PermissionResponse,
  RefreshTokenRequest,
  UserPermissionsResponse
} from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:8080/api/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setTokens(response);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  validateToken(): Observable<ValidateTokenResponse> {
    return this.http.get<ValidateTokenResponse>(`${this.apiUrl}/validate-token`, {
      headers: this.getAuthHeaders()
    });
  }

  hasPermission(recurso: string, accion: string): Observable<boolean> {
    return this.http.get<PermissionResponse>(
      `${this.apiUrl}/check-permission/${recurso}/${accion}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => response.hasPermission),
      catchError(() => [false])
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const request: RefreshTokenRequest = { refreshToken };
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, request).pipe(
      tap(response => {
        this.setTokens(response);
      })
    );
  }

  logout(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.http.post(`${this.apiUrl}/logout`, {}, {
        headers: this.getAuthHeaders()
      }).subscribe();
    }
    
    this.clearTokens();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  private setTokens(response: AuthResponse): void {
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
    localStorage.setItem('user_info', JSON.stringify({
      usuarioId: response.usuarioId,
      username: response.username,
      roles: response.roles,
      permisos: response.permisos
    }));
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUserInfo(): any {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  getUserPermissions(): Observable<UserPermissionsResponse> {
    return this.http.get<UserPermissionsResponse>(
      `${this.apiUrl}/user-permissions`,
      { headers: this.getAuthHeaders() }
    );
  }
    
}