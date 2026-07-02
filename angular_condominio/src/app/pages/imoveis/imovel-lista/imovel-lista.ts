import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/AuthService';
import { NotificationService } from '../../../shared/modals/notification/services/notification-service';
import { DialogService } from '../../../shared/modals/services/dialog-service';
import { PaginatedResponse } from '../../../shared/models/paginated-response.model';
import { ImovelService } from '../services/imovel-service';
import { Imovel } from '../imovel.model';

@Component({
  selector: 'app-imovel-lista',
  standalone: false,
  templateUrl: './imovel-lista.html',
  styleUrls: ['../../../shared/styles/lista-tabela.css']
})
export class ImovelLista {
  imoveis: Imovel[] = [];
  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  currentSearchBloco: string = '';
  currentSearchApartamento: string = '';
  orderBy: string = 'bloco';
  direction: string = 'ASC';

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

  carregar(): void {
    this.imovelService.getAllPage(this.pageIndex, this.pageSize, this.orderBy, this.direction, 
        this.currentSearchBloco, this.currentSearchApartamento).subscribe({
      next: (res: PaginatedResponse<Imovel>) => {
        if (res && res.sucesso) {
          this.imoveis = Array.isArray(res.dados.items) ? res.dados.items : [];
          this.totalCount = res.dados.totalCount;
          this.pageIndex = res.dados.pageIndex;
          this.pageSize = res.dados.pageSize;
        } else {
          this.notificationService.showError('Erro ao carregar imóveis.');
        }
      },
      error: (err) => {
        this.notificationService.showError('Erro ao carregar imóveis.');
        console.error(err);
      }
    });
  }

  onFiltersChange(filters: { searchBloco?: string; searchApartamento?: string; pageSize?: number }) {
    this.currentSearchBloco = filters.searchBloco || '';
    this.currentSearchApartamento = filters.searchApartamento || '';
    this.pageSize = filters.pageSize || this.pageSize;
    this.pageIndex = 0;
    this.carregar();
  }

  onPageChange(page: number) {
    this.pageIndex = page;
    this.carregar();
  }

  sortBy(column: string) {
    if (this.orderBy === column) {
      this.direction = this.direction === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.orderBy = column;
      this.direction = 'ASC';
    }
    this.carregar();
  }

  novo(): void { this.router.navigate(['/imoveis/novo']); }

  editar(id?: string): void { this.router.navigate(['/imoveis/', id]); }

  excluir(id?: string): void {
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
      } else {
        this.notificationService.showAlerta('Exclusão cancelada pelo usuário.');
      }
    });
  }
}
