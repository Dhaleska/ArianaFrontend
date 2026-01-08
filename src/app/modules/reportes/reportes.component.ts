// src/app/modules/reportes/reportes.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-reportes',
  template: `
    <div class="module-container">
      <h1>Módulo de Reportes</h1>
      <p>Usuario: {{ userInfo?.username }}</p>
      <p>Has accedido exitosamente al módulo de Reportes</p>
    </div>
  `,
  styles: [`
    .module-container {
      padding: 20px;
    }
    h1 {
      color: #2c3e50;
      border-bottom: 2px solid #f39c12;
      padding-bottom: 10px;
    }
  `]
})
export class ReportesComponent implements OnInit {
  userInfo: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
  }
}