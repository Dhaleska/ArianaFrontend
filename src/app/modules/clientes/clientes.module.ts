// src/app/modules/clientes/clientes.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ClientesComponent } from './clientes.component';
import { ClienteService } from '../../auth/services/cliente.service';

const routes: Routes = [
  { path: '', component: ClientesComponent }
];

@NgModule({
  declarations: [
    ClientesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    ClienteService
  ]
})
export class ClientesModule { }