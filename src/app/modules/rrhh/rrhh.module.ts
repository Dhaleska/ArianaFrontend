// src/app/modules/rrhh/rrhh.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RrhhComponent } from './rrhh.component';

const routes: Routes = [
  { path: '', component: RrhhComponent }
];

@NgModule({
  declarations: [
    RrhhComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class RrhhModule { }