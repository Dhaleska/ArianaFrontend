import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const recurso = route.data['recurso'];
    const accion = route.data['accion'] || 'read';

    console.log('=== PermissionGuard ===');
    console.log('Recurso:', recurso);
    console.log('Acción:', accion);

    if (!recurso) {
      return of(true);
    }

    return this.authService.hasPermission(recurso, accion).pipe(
      map(hasPermission => {
        console.log('Resultado hasPermission:', hasPermission);
        if (!hasPermission) {
          console.warn(`Acceso denegado a ${recurso}:${accion}`);
          this.router.navigate(['/home']);
        }
        return hasPermission;
      }),
      catchError((err) => {
        console.error('Error en PermissionGuard:', err);
        this.router.navigate(['/home']);
        return of(false);
      })
    );
  }
}
