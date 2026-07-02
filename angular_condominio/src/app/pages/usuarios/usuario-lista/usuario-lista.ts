import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnumService } from '../../../shared/services/enum.service';
import { NotificationService } from '../../../shared/modals/notification/services/notification-service';
import { DialogService } from '../../../shared/modals/services/dialog-service';
import { PaginatedResponse } from '../../../shared/models/paginated-response.model';
import { UsuarioService } from '../services/usuario-service';
import { Usuario } from '../usuario.model';

@Component({
  selector: 'app-usuario-lista',
  templateUrl: './usuario-lista.html',
  standalone: false,
  styleUrls: ['../../../shared/styles/lista-tabela.css']
})
export class UsuarioLista implements OnInit {
  usuarios: Usuario[] = [];
  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  currentSearch: string = '';
  orderBy: string = 'userName';
  direction: string = 'ASC';

  tipoRoleMap = new Map<number, string>();
  tipoUserAtivoMap = new Map<number, string>();
  tipoEmpresaAtivoMap = new Map<number, string>();

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private enumService: EnumService
  ) { }

  ngOnInit(): void {
    this.carregar();

    this.enumService.getTipoRoleMap().subscribe(map => this.tipoRoleMap = map);
    this.enumService.getTipoUserAtivoMap().subscribe(map => this.tipoUserAtivoMap = map);
    this.enumService.getTipoEmpresaAtivoMap().subscribe(map => this.tipoEmpresaAtivoMap = map);
  }

  getRoleLabel(value: number): string {
    return this.tipoRoleMap.get(value) || '';
  }

  getUserAtivoLabel(value: number): string {
    return this.tipoUserAtivoMap.get(value) || '';
  }

  getEmpresaAtivoLabel(value: number): string {
    return this.tipoEmpresaAtivoMap.get(value) || '';
  }

  carregar(): void {
      this.usuarioService.getAllPage(this.pageIndex, this.pageSize, this.orderBy, this.direction, this.currentSearch).subscribe({
        next: (res: PaginatedResponse<Usuario>) => {
          if (res && res.sucesso) {
            this.usuarios = Array.isArray(res.dados.items) ? res.dados.items : [];
            this.totalCount = res.dados.totalCount;
            this.pageIndex = res.dados.pageIndex;
            this.pageSize = res.dados.pageSize;
          } else {
            this.notificationService.showError('Erro ao carregar usuários.');
          }
        },
        error: (err) => {
          this.notificationService.showError('Erro ao carregar usuários.');
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

  novo(): void { this.router.navigate(['/usuarios/novo']); }
  
  editar(id?: string): void { if (id) this.router.navigate([`/usuarios/${id}`]); }

  excluir(id?: string): void {
    this.dialogService.openConfirmation('Tem certeza que deseja excluir este usuário?').subscribe(confirmed => {
      if (confirmed) {
        this.usuarioService.excluir(String(id)).subscribe({
          next: () => {
            this.notificationService.showSuccess('Usuário excluído com sucesso!');
            this.carregar();
          },
          error: (err) => {
            if (err.error && err.error.erro) {
              this.notificationService.showAlerta(err.error.erro);
            } else {
              this.notificationService.showError('Erro ao excluir usuário.');
              console.error('Erro ao excluir usuário: ', err);
            }
          }
        });
      } else {
        this.notificationService.showAlerta('Exclusão cancelada pelo usuário.');
      }
    });
  }
}
