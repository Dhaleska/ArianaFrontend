// src/app/modules/rrhh/rrhh.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-rrhh',
  template: `
    <div class="module-container">
      <h1>Módulo de Recursos Humanos</h1>
      <p>Usuario: {{ userInfo?.username }}</p>
      <p>Has accedido exitosamente al módulo de RRHH</p>
    </div>
  `,
  styles: [`
    .module-container {
      padding: 20px;
    }
    h1 {
      color: #2c3e50;
      border-bottom: 2px solid #e74c3c;
      padding-bottom: 10px;
    }
  `]
})
export class RrhhComponent implements OnInit {
  userInfo: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
  }
}