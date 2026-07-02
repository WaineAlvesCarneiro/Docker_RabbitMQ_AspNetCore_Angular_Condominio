import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario-service';
import { EmpresaService } from '../../empresas/services/empresa-service';
import { Usuario } from '../usuario.model';
import { EnumService } from '../../../shared/services/enum.service';
import { NotificationService } from '../../../shared/modals/notification/services/notification-service';
import { SelectOption } from '../../../shared/components/select/select.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.html',
  standalone: false,
  styleUrls: ['../../../../styles/_form.scss']
})
export class UsuarioForm implements OnInit, AfterViewInit {
  @ViewChild(InputComponent) userNameInput!: InputComponent;
  
  ngAfterViewInit(): void {
    if (this.userNameInput) {
      this.userNameInput.setFocus();
    }
  }

  logForm(): void {
    console.log('form.valid:', this.form.valid);
    console.log('form.value:', this.form.getRawValue());
    Object.keys(this.form.controls).forEach(k => {
      const c: any = this.form.get(k);
      console.log(k, 'valid=', c?.valid, 'value=', c?.value, 'errors=', c?.errors);
    });
  }
  
  form!: FormGroup;
  empresas: any[] = [];
  empresaOptions: SelectOption[] = [];
  tiposRole: { value: number; label: string }[] = [];
  tiposUserAtivo: { value: number; label: string }[] = [];
  tiposEmpresaAtivo: { value: number; label: string }[] = [];

  isSaving = false;
  id?: string;
  formSubmetido = false;

  constructor(
    private usuarioService: UsuarioService,
    private empresaService: EmpresaService,
    private enumService: EnumService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [{ value: 0, disabled: true }],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [null, Validators.required],
      ativo: 1,
      empresaId: 0
    });

    this.enumService.getTipoRoleArray().subscribe(options => this.tiposRole = options);
    this.enumService.getTipoUserAtivoArray().subscribe(options => this.tiposUserAtivo = options);
    this.enumService.getTipoEmpresaAtivoArray().subscribe(options => this.tiposEmpresaAtivo = options);

    this.empresaService.getAll().subscribe({
      next: (r) => this.empresas = r,
      error: () => this.notificationService.showError('Erro ao carregar empresas')
    });

    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) this.carregar(this.id);

    this.empresaService.getAll().subscribe({
      next: (res) => {
        this.empresas = res;
        this.empresaOptions = this.empresas.map(e => ({
          value: e.id,
          label: e.razaoSocial
        }));
      }
    });
  }

  carregar(id: string): void {
    this.usuarioService.getId(id).subscribe({
      next: (u) => {
        this.form.patchValue(u);
        this.form.get('passwordHash')?.clearValidators();
        this.form.get('passwordHash')?.updateValueAndValidity();
      },
      error: (err) => {
        this.notificationService.showError('Erro ao carregar usuário');
        console.error(err);
      }
    });
  }

  salvar(): void {
    this.formSubmetido = true;
    this.form.markAllAsTouched();
    
    if (this.form.invalid) {
      this.notificationService.showAlerta('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const usuario: Usuario = {
      id: this.id ? this.id : '0',
      ativo: 1,
      empresaAtiva: 1,
      empresaId: Number(this.form.get('role')?.value) === 1 ? null : Number(this.form.get('empresaId')?.value),
      userName: this.form.get('userName')?.value,
      email: this.form.get('email')?.value,
      role: Number(this.form.get('role')?.value),
      dataInclusao: new Date().toISOString(),
      dataAlteracao: Number(this.id) !== 0 ? new Date().toISOString() : null
    };

    this.isSaving = true;

    const request = this.id
      ? this.usuarioService.atualizar(usuario)
      : this.usuarioService.criar(usuario);

    request.subscribe({
      next: () => {
        this.notificationService.showSuccess('Usuário salvo com sucesso!');
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        this.notificationService.showError('Erro ao salvar usuário.');
        this.isSaving = false;
        console.error(err);
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  cancelar(): void {
    this.formSubmetido = false;
    this.router.navigate(['/usuarios']);
  }
}
