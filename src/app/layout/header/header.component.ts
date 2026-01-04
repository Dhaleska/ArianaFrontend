// header.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  @Input() showMenuButton = false;
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(
    public router: Router
  ) {}

  ngOnInit(): void {}

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }
}