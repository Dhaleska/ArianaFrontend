// src/app/modules/resources-home/resources-home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserPermissionsResponse } from '../../shared/interfaces/auth.interfaces';

interface RecursoCard {
  nombre: string;
  nombreDisplay: string;
  icono: string;
  ruta: string;
}

@Component({
  selector: 'app-resources-home',
  templateUrl: './resources-home.component.html',
  styleUrls: ['./resources-home.component.scss']
})
export class ResourcesHomeComponent implements OnInit {
  
  username: string = '';
  recursos: RecursoCard[] = [];
  loading = true;
  error = '';

  // Configuración de cada recurso con iconos de FontAwesome
  private recursoConfig: { [key: string]: Partial<RecursoCard> } = {
    'cargo': {
      nombreDisplay: 'Cargos',
      icono: 'fa-solid fa-briefcase',
      ruta: '/dashboard/cargos'
    },
    'rrhh': {
      nombreDisplay: 'Personal',
      icono: 'fa-solid fa-user-gear',
      ruta: '/dashboard/rrhh'
    },
    'reportes': {
      nombreDisplay: 'Reportes',
      icono: 'fa-solid fa-chart-pie',
      ruta: '/dashboard/reportes'
    },
    'security': {
      nombreDisplay: 'Seguridad',
      icono: 'fa-solid fa-shield-halved',
      ruta: '/dashboard/security'
    },
    'registro': {
      nombreDisplay: 'Registro',
      icono: 'fa-solid fa-pen',
      ruta: '/dashboard/registro'
    },
    'seguimiento': {
      nombreDisplay: 'Seguimiento',
      icono: 'fa-solid fa-chart-line',
      ruta: '/dashboard/seguimiento'
    },
    'historial': {
      nombreDisplay: 'Historial',
      icono: 'fa-solid fa-clock-rotate-left',
      ruta: '/dashboard/historial'
    },
    'notificacion': {
      nombreDisplay: 'Notificación',
      icono: 'fa-solid fa-bell',
      ruta: '/dashboard/notificacion'
    },
    'servicios': {
      nombreDisplay: 'Servicios',
      icono: 'fa-solid fa-plus',
      ruta: '/dashboard/servicios'
    },
    'clientes': {
      nombreDisplay: 'Clientes',
      icono: 'fa-solid fa-users',
      ruta: '/dashboard/clientes'
    }
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserPermissions();
  }

  loadUserPermissions(): void {
    this.authService.getUserPermissions().subscribe({
      next: (response: UserPermissionsResponse) => {
        this.username = response.username;
        this.recursos = this.mapRecursos(response.recursos);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar permisos:', err);
        this.error = 'Error al cargar los recursos';
        this.loading = false;
      }
    });
  }

  private mapRecursos(recursos: string[]): RecursoCard[] {
    return recursos.map(recurso => {
      const config = this.recursoConfig[recurso.toLowerCase()] || {};
      return {
        nombre: recurso,
        nombreDisplay: config.nombreDisplay || this.capitalizar(recurso),
        icono: config.icono || 'fa-solid fa-folder',
        ruta: config.ruta || `/dashboard/${recurso.toLowerCase()}`
      };
    });
  }

  private capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  navegarA(ruta: string): void {
    this.router.navigate([ruta]);
  }

  logout(): void {
    this.authService.logout();
  }
}