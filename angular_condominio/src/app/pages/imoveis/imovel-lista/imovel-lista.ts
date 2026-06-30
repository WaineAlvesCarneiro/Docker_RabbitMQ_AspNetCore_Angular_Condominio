import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/AuthService';
import { Imovel } from '../imovel.model';
import { ImovelService } from '../services/imovel-service';
import { NotificationService } from '../../../shared/notification/services/notification-service';
import { DialogService } from '../../../shared/modal/services/dialog-service';

@Component({
  selector: 'app-imovel-lista',
  standalone: false,
  templateUrl: './imovel-lista.html',
  styleUrl: './imovel-lista.css'
})
export class ImovelLista {
  imoveis: Imovel[] = [];
  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 0;

  userRole: string | null = null;
  isPorteiro = false;

  constructor(
    private authService: AuthService,
    private imovelService: ImovelService,
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
    this.imovelService.getAllPage(page, 10, 'bloco', 'ASC').subscribe({
      next: response => {
        if (response.sucesso) {
          this.imoveis = Array.isArray(response.dados.items) ? response.dados.items : [];
          this.totalCount = response.dados.totalCount;
          this.pageIndex = response.dados.pageIndex;
          this.pageSize = response.dados.pageSize;
        } else {
          if (response.erro) {
            this.notificationService.showAlerta(response.erro);
          } else {
            this.notificationService.showError('Erro ao carregar imoveis.');
            console.error('Erro ao carregar imoveis metodo carregarImoveisPage: ', response.erro);
          }
        }
      },
      error: (err) => {
        if (err.error && err.error.erro) {
          this.notificationService.showAlerta(err.error.erro);
        } else {
          this.notificationService.showError('Erro ao carregar imóvel.');
          console.error('Erro ao carregar imóvel metodo carregarImoveisPage: ', err);
        }
      }
    });
  }

  novo(): void { this.router.navigate(['/imoveis/novo']); }

  editar(id?: string) { this.router.navigate(['/imoveis/', id]); }

  excluir(id?: string) {
    if (!id) return;
    this.dialogService.openConfirmation('Tem certeza que deseja excluir este imóvel?').subscribe(confirmed => {
      if (confirmed) {
        this.imovelService.excluir(id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Imóvel excluido com sucesso!');
            this.carregar();
          },
          error: (err) => {
            if (err.error && err.error.erro) {
              this.notificationService.showAlerta(err.error.erro);
            } else {
              this.notificationService.showError('Erro ao excluir imóvel.');
              console.error('Erro ao excluir imóvel metodo excluirImovel: ', err);
            }
          }
        });
      }
    });
  }
}
