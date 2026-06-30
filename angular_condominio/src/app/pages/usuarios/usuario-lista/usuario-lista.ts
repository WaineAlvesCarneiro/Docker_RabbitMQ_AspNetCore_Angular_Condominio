import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario-service';
import { Usuario } from '../usuario.model';
import { EnumService } from '../../../shared/services/enum.service';
import { NotificationService } from '../../../shared/modals/notification/services/notification-service';
import { DialogService } from '../../../shared/modals/services/dialog-service';

@Component({
  selector: 'app-usuario-lista',
  templateUrl: './usuario-lista.html',
  standalone: false,
  styleUrl: '../../../shared/styles/lista-tabela.css'
})
export class UsuarioLista implements OnInit {
  usuarios: Usuario[] = [];
  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 0;

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

  carregar(page: number = 0) {
    this.usuarioService.getAllPage(page, 10, 'username', 'ASC').subscribe({
      next: response => {
        if (response.sucesso) {
          this.usuarios = Array.isArray(response.dados.items) ? response.dados.items : [];
          this.totalCount = response.dados.totalCount;
          this.pageIndex = response.dados.pageIndex;
          this.pageSize = response.dados.pageSize;
        } else {
          if (response.erro) {
            this.notificationService.showAlerta(response.erro);
          } else {
            this.notificationService.showError('Erro ao carregar usuários.');
            console.error('Erro ao carregar usuários metodo carregar: ', response.erro);
          }
        }
        },
      error: (err) => {
        if (err.error && err.error.erro) {
          this.notificationService.showAlerta(err.error.erro);
        } else {
          this.notificationService.showError('Erro ao carregar usuários.');
          console.error('Erro ao carregar usuários metodo carregar: ', err);
        }
      }
    });
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