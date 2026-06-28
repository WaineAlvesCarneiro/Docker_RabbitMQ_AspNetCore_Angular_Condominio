import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
  standalone: false
})
export class Layout implements OnInit {
  userName: string | null = null;

  title(): string {
    return 'Condomínio'; 
  }

  isLoggedIn = false;
  isSidebarMinimized = false;
  userRole: string | null = null;
  isSuporte = false;
  isSindicoOrPorteiro = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.getUserRole();
    this.isSuporte = this.userRole === 'Suporte' || this.userRole === '1';
    this.isSindicoOrPorteiro = this.userRole === 'Sindico' || this.userRole === 'Porteiro' || this.userRole === '2' || this.userRole === '3';

    this.userName = this.authService.getUserName();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
