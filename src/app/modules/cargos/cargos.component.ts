// src/app/modules/cargos/cargos.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-cargos',
  template: `
    <div class="module-container">
      <h1>Módulo de Cargos</h1>
      <p>Usuario: {{ userInfo?.username }}</p>
      <p>Has accedido exitosamente al módulo de Cargos</p>
    </div>
  `,
  styles: [`
    .module-container {
      padding: 20px;
    }
    h1 {
      color: #2c3e50;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
    }
  `]
})
export class CargosComponent implements OnInit {
  userInfo: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
  }
}