// src/app/layout/sidebar/sidebar.component.ts
import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { filter } from 'rxjs';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  permiso: string;
  subItems?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter<void>();

  userInfo: any;
  menuItems: MenuItem[] = [];
  currentRoute: string = '';


  private allMenuItems: MenuItem[] = [
    {
      label: 'Registro',
      route: '/dashboard/registro',
      icon: 'fa-solid fa-pen',
      permiso: 'registro:read'
    },
    {
      label: 'Seguimiento',
      route: '/dashboard/seguimiento',
      icon: 'fa-solid fa-magnifying-glass',
      permiso: 'seguimiento:read'
    },
    {
      label: 'Historial',
      route: '/dashboard/historial',
      icon: 'fa-solid fa-file-lines',
      permiso: 'historial:read'
    },
    {
      label: 'Notificación',
      route: '/dashboard/notificacion',
      icon: 'fa-solid fa-bell',
      permiso: 'notificacion:read'
    },
    {
      label: 'Servicios',
      route: '/dashboard/servicios',
      icon: 'fa-solid fa-plus',
      permiso: 'servicios:read'
    },
    {
      label: 'Personal',
      route: '/dashboard/rrhh',
      icon: 'fa-solid fa-user',
      permiso: 'rrhh:read'
    },
    {
      label: 'Cliente',
      route: '/dashboard/clientes',
      icon: 'fa-solid fa-users',
      permiso: 'clientes:read'
    },
    {
      label: 'Reportes',
      route: '/dashboard/reportes',
      icon: 'fa-solid fa-chart-column',
      permiso: 'reportes:read'
    },
    {
      label: 'Cargos',
      route: '/dashboard/cargos',
      icon: 'fa-solid fa-briefcase',
      permiso: 'cargo:read'
    }
  ];
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe({
      next: (event: NavigationEnd) => {
        this.currentRoute = event.url;
      }
    });
  }

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    this.currentRoute = this.router.url;
    this.loadMenuBasedOnPermissions();
  }

  loadMenuBasedOnPermissions(): void {
    const userPermisos = this.userInfo?.permisos || [];
    
    this.menuItems = this.allMenuItems.filter(item => {
      if (!item.permiso) return true;
      return userPermisos.includes(item.permiso);
    });
  }

  onItemClick(route: string): void {
    this.router.navigate([route]);
    
    if (window.innerWidth <= 768) {
      this.closeSidenav.emit();
    }
  }

  isRouteActive(route: string): boolean {
    if (!route) return false;
    if (route === '/dashboard' && this.currentRoute === '/dashboard') {
      return true;
    }
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }

  hasPermission(permiso: string): boolean {
    if (!permiso) return true;
    const userPermisos = this.userInfo?.permisos || [];
    return userPermisos.includes(permiso);
  }
}