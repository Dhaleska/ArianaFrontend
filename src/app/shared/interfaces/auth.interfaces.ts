// src/app/shared/interfaces/auth.interfaces.ts

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresAt: string;
  usuarioId: number;
  usuarioSecurityId: number;
  username: string;
  roles: string[];
  permisos: string[];
}

export interface ValidateTokenResponse {
  valid: boolean;
  message: string;
  usuarioId?: number;
  usuarioSecurityId?: number;
  username?: string;
  roles?: string[];
  permisos?: string[];
  expiresAt?: string;
}

export interface PermissionResponse {
  hasPermission: boolean;
  message: string;
  recurso: string;
  accion: string;
  usuarioId: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============ NUEVAS INTERFACES ============

export interface RolInfo {
  rolId: number;
  nombre: string;
  descripcion: string;
}

export interface PermisoInfo {
  permisoId: number;
  recurso: string;
  accion: string;
  descripcion: string;
  permisoCompleto: string;
}

export interface UserPermissionsResponse {
  usuarioId: number;
  usuarioSecurityId: number;
  username: string;
  roles: RolInfo[];
  permisos: PermisoInfo[];
  recursos: string[];
}