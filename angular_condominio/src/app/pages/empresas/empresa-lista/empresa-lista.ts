import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpresaService } from '../services/empresa-service';
import { Empresa } from '../empresa.model';
import { NotificationService } from '../../../shared/modals/notification/services/notification-service';
import { DialogService } from '../../../shared/modals/services/dialog-service';
import { EnumService } from '../../../shared/services/enum.service';

@Component({
  selector: 'app-empresa-lista',
  templateUrl: './empresa-lista.html',
  standalone: false,
  styleUrl: '../../../shared/styles/lista-tabela.css'
})
export class EmpresaLista implements OnInit {
  empresas: Empresa[] = [];
  tipoCondominioMap = new Map<number, string>();
  tipoEmpresaAtivoMap = new Map<number, string>();

  constructor(
    private empresaService: EmpresaService,
    private router: Router,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private enumService: EnumService
  ) { }

  ngOnInit(): void {
    this.carregar();

    this.enumService.getTipoCondominioMap().subscribe(map => this.tipoCondominioMap = map);
    this.enumService.getTipoEmpresaAtivoMap().subscribe(map => this.tipoEmpresaAtivoMap = map);
  }

  getTipoCondominioLabel(value: number): string {
    return this.tipoCondominioMap.get(value) || '';
  }

  getAtivoLabel(value: number): string {
    return this.tipoEmpresaAtivoMap.get(value) || '';
  }

  carregar(): void {
    this.empresaService.getAll().subscribe({
      next: (res) => this.empresas = res,
      error: (err) => {
        this.notificationService.showError('Erro ao carregar empresas.');
        console.error(err);
      }
    });
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
