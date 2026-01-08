// src/app/layout/header/header.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  @Input() showMenuButton = false;
  @Output() toggleSidenav = new EventEmitter<void>();

  userInfo: any;
  isAuthenticated: boolean = false;

  constructor(
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    this.isAuthenticated = !!this.userInfo;
  }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}