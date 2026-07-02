import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/AuthService';
import { NotificationService } from '../../../shared/modals/notification/services/notification-service';
import { DialogService } from '../../../shared/modals/services/dialog-service';
import { PaginatedResponse } from '../../../shared/models/paginated-response.model';
import { MoradorService } from '../services/morador-service';
import { Morador } from '../morador.model';

@Component({
  selector: 'app-morador-lista',
  standalone: false,
  templateUrl: './morador-lista.html',
  styleUrls: ['../../../shared/styles/lista-tabela.css']
})
export class MoradorLista {
  moradores: Morador[] = [];
  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  currentSearch: string = '';
  orderBy: string = 'nome';
  direction: string = 'ASC';

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

  carregar(): void { 
    this.moradorService.getAllPage(this.pageIndex, this.pageSize, this.orderBy, this.direction, this.currentSearch).subscribe({
      next: (res: PaginatedResponse<Morador>) => {
        if (res && res.sucesso) {
          this.moradores = Array.isArray(res.dados.items) ? res.dados.items : [];
          this.totalCount = res.dados.totalCount;
          this.pageIndex = res.dados.pageIndex;
          this.pageSize = res.dados.pageSize;
        } else {
          this.notificationService.showError('Erro ao carregar moradores.');
        }
      },
      error: (err) => {
        this.notificationService.showError('Erro ao carregar moradores.');
        console.error(err);
      }
    });
  }

  onFiltersChange(filters: { search?: string; pageSize?: number }) {
    this.currentSearch = filters.search || '';
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
