// src/app/modules/personal/personal.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { PersonalComponent } from './personal.component';
import { PersonalService } from '../../auth/services/personal.service';

const routes: Routes = [
  { path: '', component: PersonalComponent }
];

@NgModule({
  declarations: [
    PersonalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    PersonalService
  ]
})
export class PersonalModule { }