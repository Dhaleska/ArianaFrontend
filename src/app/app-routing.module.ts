// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { PermissionGuard } from './shared/guards/permission.guard';
import { DashboardHomeComponent } from './modules/dashboard-home/dashboard-home.component';
import { ResourcesHomeComponent } from './modules/resources-home/resources-home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: ResourcesHomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardHomeComponent
      },
      {
        path: 'cargos',
        loadChildren: () => import('./modules/cargos/cargos.module').then(m => m.CargosModule),
        canActivate: [PermissionGuard],
        data: { recurso: 'cargo', accion: 'read' }
      },
      {
        path: 'rrhh',
        loadChildren: () => import('./modules/rrhh/rrhh.module').then(m => m.RrhhModule),
        canActivate: [PermissionGuard],
        data: { recurso: 'rrhh', accion: 'read' }
      },
      {
        path: 'reportes',
        loadChildren: () => import('./modules/reportes/reportes.module').then(m => m.ReportesModule),
        canActivate: [PermissionGuard],
        data: { recurso: 'reportes', accion: 'read' }
      },
      {
        path: 'clientes',
        loadChildren: () => import('./modules/clientes/clientes.module').then(m => m.ClientesModule),
        canActivate: [PermissionGuard],
        data: { recurso: 'clientes', accion: 'read' }
      },
      {
        path: 'personal',
        loadChildren: () => import('./modules/personal/personal.module').then(m => m.PersonalModule),
        canActivate: [PermissionGuard],
        data: { recurso: 'personal', accion: 'read' }
      }      
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }