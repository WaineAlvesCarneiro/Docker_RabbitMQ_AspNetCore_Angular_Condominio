import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/AuthService';
import { NotificationService } from '../../shared/modals/notification/services/notification-service';
import { UsuarioService } from '../usuarios/services/usuario-service';
import { EmpresaService } from '../empresas/services/empresa-service';
import { ImovelService } from '../imoveis/services/imovel-service';
import { MoradorService } from '../moradores/services/morador-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  loading = true;
  error: string | null = null;
  data = {
    usuarios: [],
    empresas: [],
    imoveis: [],
    moradores: []
  };

  titulo = 'Bem-vindo ao Painel de Controle!';
  userRole: string | null = null;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private empresaService: EmpresaService,
    private imovelService: ImovelService,
    private moradorService: MoradorService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.fetchDashboard();
  }

  fetchDashboard(): void {
    if (!this.userRole) {
      this.error = 'Acesso não autorizado.';
      this.loading = false;
      return;
    }

    this.loading = true;
    const requests: Promise<any>[] = [];

    if (this.userRole === 'Suporte') {
      requests.push(this.usuarioService.getAll().toPromise().then(res => ({ usuarios: res })));
      requests.push(this.empresaService.getAll().toPromise().then(res => ({ empresas: res })));
    }

    if (this.userRole === 'Sindico' || this.userRole === 'Porteiro') {
      requests.push(this.imovelService.getAll().toPromise().then(res => ({ imoveis: res })));
      requests.push(this.moradorService.getAll().toPromise().then(res => ({ moradores: res })));
    }

    Promise.all(requests)
      .then(results => {
        const combined = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        this.data = { ...this.data, ...combined };
        this.error = null;
      })
      .catch(err => {
        this.error = err.message;
        this.notificationService.showError('Erro ao carregar dados do dashboard.');
      })
      .finally(() => this.loading = false);
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
