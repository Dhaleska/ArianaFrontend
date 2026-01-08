// src/app/modules/cargos/cargos.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CargosComponent } from './cargos.component';

const routes: Routes = [
  { path: '', component: CargosComponent }
];

@NgModule({
  declarations: [
    CargosComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CargosModule { }