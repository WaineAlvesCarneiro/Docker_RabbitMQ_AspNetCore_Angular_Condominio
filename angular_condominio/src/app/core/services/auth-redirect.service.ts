import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/modals/notification/services/notification-service';

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

    this.router.navigate(['/dashboard']);

    this.notificationService.showSuccess('Login realizado com sucesso! Bem-vindo(a).');
  }
}
