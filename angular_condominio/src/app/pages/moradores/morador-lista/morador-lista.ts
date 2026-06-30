import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Morador } from '../morador.model';
import { MoradorService } from '../services/morador-service';
import { AuthService } from '../../../core/services/AuthService';
import { NotificationService } from '../../../shared/modals/notification/services/notification-service';
import { DialogService } from '../../../shared/modals/services/dialog-service';

@Component({
  selector: 'app-morador-lista',
  standalone: false,
  templateUrl: './morador-lista.html',
  styleUrl: '../../../shared/styles/lista-tabela.css'
})
export class MoradorLista {
  moradores: Morador[] = [];
  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 0;

  userRole: string | null = null;
  isPorteiro = false;

  constructor(
    private authService: AuthService,
    private moradorService: MoradorService,
    private router: Router,
    private notificationService: NotificationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.isPorteiro = this.userRole === 'Porteiro' || this.userRole === '3';
    this.carregar();
  }

  carregar(page: number = 0) {
    this.moradorService.getAllPage(page, 10, 'nome', 'ASC').subscribe({
      next: response => {
        if (response.sucesso) {
          this.moradores = Array.isArray(response.dados.items) ? response.dados.items : [];
          this.totalCount = response.dados.totalCount;
          this.pageIndex = response.dados.pageIndex;
          this.pageSize = response.dados.pageSize;
        } else {
          if (response.erro) {
            this.notificationService.showAlerta(response.erro);
          } else {
            this.notificationService.showError('Erro ao carregar moradores.');
            console.error('Erro ao carregar moradores metodo carregarMoradoresPage: ', response.erro);
          }
        }
      },
      error: (err) => {
        if (err.error && err.error.erro) {
          this.notificationService.showAlerta(err.error.erro);
        } else {
          this.notificationService.showError('Erro ao carregar moradores.');
          console.error('Erro ao carregar moradores metodo carregarMoradoresPage: ', err);
        }
      }
    });
  }

  novo(): void { this.router.navigate(['/moradores/novo']); }

  editar(id?: string): void { this.router.navigate(['/moradores/', id]); }

  excluir(id?: string): void {
    this.dialogService.openConfirmation('Tem certeza que deseja excluir este morador?').subscribe(confirmed => {
      if (confirmed) {
        this.moradorService.excluir(String(id)).subscribe({
          next: () => {
            this.notificationService.showSuccess('Morador excluído com sucesso!');
            this.carregar();
          },
          error: (err) => {
            if (err.error && err.error.erro) {
              this.notificationService.showAlerta(err.error.erro);
            } else {
              this.notificationService.showError('Erro ao excluir morador.');
              console.error(`Erro ao excluir morador ${id}:`, err);
            }
          }
        });
      } else {
        this.notificationService.showAlerta('Exclusão cancelada pelo usuário.');
      }
    });
  }
}
