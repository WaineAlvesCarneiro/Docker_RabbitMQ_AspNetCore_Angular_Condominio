import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/modals/notification/services/notification-service';
import { DialogService } from '../../../shared/modals/services/dialog-service';
import { EnumService } from '../../../shared/services/enum.service';
import { PaginatedResponse } from '../../../shared/models/paginated-response.model';
import { EmpresaService } from '../services/empresa-service';
import { Empresa } from '../empresa.model';

@Component({
  selector: 'app-empresa-lista',
  templateUrl: './empresa-lista.html',
  standalone: false,
  styleUrls: ['../../../shared/styles/lista-tabela.css']
})
export class EmpresaLista implements OnInit {
  empresas: Empresa[] = [];
  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  currentSearch: string = '';
  orderBy: string = 'razaoSocial';
  direction: string = 'ASC';

  tipoCondominioMap = new Map<number, string>();
  tipoEmpresaAtivoMap = new Map<number, string>();

  constructor(
    private empresaService: EmpresaService,
    private router: Router,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private enumService: EnumService
  ) {}

  ngOnInit(): void {
    this.carregar();

    this.enumService.getTipoCondominioMap().subscribe(map => this.tipoCondominioMap = map);
    this.enumService.getTipoEmpresaAtivoMap().subscribe(map => this.tipoEmpresaAtivoMap = map);
  }

  getTipoCondominioLabel(value: number): string {
    return this.tipoCondominioMap.get(value) || '';
  }

  getEmpresaAtivoLabel(value: number): string {
    return this.tipoEmpresaAtivoMap.get(value) || '';
  }

  carregar(): void {
    this.empresaService.getAllPage(this.pageIndex, this.pageSize, this.orderBy, this.direction, this.currentSearch).subscribe({
      next: (res: PaginatedResponse<Empresa>) => {
        if (res && res.sucesso) {
          this.empresas = Array.isArray(res.dados.items) ? res.dados.items : [];
          this.totalCount = res.dados.totalCount;
          this.pageIndex = res.dados.pageIndex;
          this.pageSize = res.dados.pageSize;
        } else {
          this.notificationService.showError('Erro ao carregar empresas.');
        }
      },
      error: (err) => {
        this.notificationService.showError('Erro ao carregar empresas.');
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

  novo(): void { this.router.navigate(['/empresas/novo']); }

  editar(id?: string): void { this.router.navigate([`/empresas/${id}`]); }

  excluir(id?: string): void {
    this.dialogService.openConfirmation('Tem certeza que deseja excluir este empresa?').subscribe(confirmed => {
      if (confirmed) {
        this.empresaService.excluir(String(id)).subscribe({
          next: () => {
            this.notificationService.showSuccess('Empresa excluído com sucesso!');
            this.carregar();
          },
          error: (err) => {
            if (err.error && err.error.erro) {
              this.notificationService.showAlerta(err.error.erro);
            } else {
              this.notificationService.showError('Erro ao excluir empresa.');
              console.error('Erro ao excluir empresa: ', err);
            }
          }
        });
      } else {
        this.notificationService.showAlerta('Exclusão cancelada pelo usuário.');
      }
    });
  }
}
