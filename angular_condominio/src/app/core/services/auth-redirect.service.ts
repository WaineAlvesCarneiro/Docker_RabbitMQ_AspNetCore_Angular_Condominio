import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../notification/services/notification-service';

@Injectable({ providedIn: 'root' })
export class AuthRedirectService {
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) { }

  redirectAfterLogin(user: any): void {
    if (user.primeiroAcesso) {
      this.router.navigate(['/definir-senha']);
      return;
    }

    switch (user.role) {
      case 'Suporte':
      case 1:
        this.router.navigate(['/empresas']);
        break;

      case 'Sindico':
      case 'Porteiro':
      case 2:
      case 3:
        this.router.navigate(['/imoveis']);
        break;

      default:
        this.router.navigate(['/dashboard']);
        break;
    }

    this.notificationService.showSuccess('Login realizado com sucesso! Bem-vindo(a).');
  }
}
