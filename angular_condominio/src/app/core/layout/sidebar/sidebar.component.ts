import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/AuthService';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false
})
export class SidebarComponent implements OnInit {
  userName: string | null = null;
  isLoggedIn = false;
  userRole: string | null = null;
  isSuporte = false;
  isSindicoOrPorteiro = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.getUserRole();
    this.isSuporte = this.userRole === 'Suporte' || this.userRole === '1';
    this.isSindicoOrPorteiro = ['Sindico', 'Porteiro', '2', '3'].includes(this.userRole ?? '');
    this.userName = this.authService.getUserName();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
