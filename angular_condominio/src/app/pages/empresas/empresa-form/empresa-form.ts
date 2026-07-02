import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empresa } from '../empresa.model';
import { EmpresaService } from '../services/empresa-service';
import { EnumService } from '../../../shared/services/enum.service';
import { buscarCep } from '../../../shared/utils/cep-utils';
import { isCnpjValid } from '../../../shared/validate/cnpj-validate';
import { NotificationService } from '../../../shared/modals/notification/services/notification-service';
import { InputComponent } from '../../../shared/components/input/input.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-empresa-form',
  templateUrl: './empresa-form.html',
  standalone: false,
  styleUrls: ['../../../../styles/_form.scss']
})
export class EmpresaForm implements OnInit, AfterViewInit {
  @ViewChild(InputComponent) razaoSocialInput!: InputComponent;

  ngAfterViewInit(): void {
    if (this.razaoSocialInput) {
      this.razaoSocialInput.setFocus();
    }
  }

  form!: FormGroup;
  isSaving = false;
  id?: string;
  formSubmetido = false;
  cnpjInvalido = false;

  tiposDeCondominio: { value: number; label: string }[] = [];
  tiposEmpresaAtivo: { value: number; label: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private enumService: EnumService
  ) { }

  async ngOnInit(): Promise<void> {
    this.form = this.fb.group({
      id: [{ value: 0, disabled: true }],
      ativo: [0, Validators.required],
      razaoSocial: ['', Validators.required],
      fantasia: ['', Validators.required],
      cnpj: ['', Validators.required],
      tipoDeCondominio: [0, Validators.required],
      nome: ['', Validators.required],
      celular: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      telefone: [null],
      email: ['', [Validators.required, Validators.email]],
      senha: [''],
      host: ['smtp.gmail.com', Validators.required],
      porta: [587, Validators.required],
      cep: ['', Validators.required],
      uf: [''],
      cidade: [''],
      endereco: [''],
      bairro: [''],
      complemento: [null]
    });

    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) 
      await this.carregar(this.id);

    this.enumService.getTipoCondominioArray().subscribe({
      next: (options) => {
        this.tiposDeCondominio = options.map(o => ({ value: Number(o.value), label: o.label }));
      },
      error: (err) => {
        console.error('Erro ao carregar tiposDeCondominio', err);
      }
    });

    this.enumService.getTipoEmpresaAtivoArray().subscribe({
      next: (options) => {
        this.tiposEmpresaAtivo = options.map(o => ({ value: Number(o.value), label: o.label }));
      },
      error: (err) => {
        console.error('Erro ao carregar tiposEmpresaAtivo', err);
      }
    });

    this.form.get('cep')?.valueChanges.subscribe((cep: string) => {
      const somenteDigitos = cep.replace(/\D/g, '');
      if (somenteDigitos.length === 8) {
        this.buscarCep(somenteDigitos);
      }
    });
  }

  async carregar(id: string): Promise<void> {
    this.empresaService.getId(id).subscribe({
      next: (u) => {
        this.form.patchValue(u);
        this.form.get('senha')?.clearValidators();
        this.form.get('senha')?.updateValueAndValidity();
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

    const empresa: Empresa = {
      id: this.id ? this.id : undefined,
      ativo: Number(this.form.get('ativo')?.value),
      tipoDeCondominio: Number(this.form.get('tipoDeCondominio')?.value),
      razaoSocial: this.form.get('razaoSocial')?.value,
      fantasia: this.form.get('fantasia')?.value,
      cnpj: this.form.get('cnpj')?.value,
      nome: this.form.get('nome')?.value,
      celular: this.form.get('celular')?.value,
      telefone: this.form.get('telefone')?.value,
      email: this.form.get('email')?.value,
      senha: this.form.get('senha')?.value,
      host: this.form.get('host')?.value,
      porta: this.form.get('porta')?.value,
      cep: this.form.get('cep')?.value,
      uf: this.form.get('uf')?.value,
      cidade: this.form.get('cidade')?.value,
      endereco: this.form.get('endereco')?.value,
      bairro: this.form.get('bairro')?.value,
      complemento: this.form.get('complemento')?.value,
      dataInclusao: new Date().toISOString(),
      dataAlteracao: this.form.get('id')?.value !== 0 ? new Date().toISOString() : null
    };

    this.isSaving = true;

    const request = empresa.id
      ? this.empresaService.atualizar(empresa)
      : this.empresaService.criar(empresa);

    request.subscribe({
      next: () => {
        this.notificationService.showSuccess('Empresa salva com sucesso');
        this.router.navigate(['/empresas']);
      },
      error: (err) => {
        this.notificationService.showError('Erro ao salvar empresa.');
        this.isSaving = false;
        console.error(err);
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  validarCnpj(): void {
    const cnpj = this.form.get('cnpj')?.value || '';
    this.cnpjInvalido = !isCnpjValid(cnpj);
  }

  onCepInput(event: any): void {
    const cep = event.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      this.buscarCep(cep);
    }
  }

  private buscarCep(cep: string): void {
    buscarCep(cep).then((data) => {
      if (!data) {
        this.notificationService.showAlerta('CEP não encontrado');
        return;
      }
      this.form.patchValue({
        uf: data.uf,
        cidade: data.cidade,
        endereco: data.endereco,
        bairro: data.bairro
      });
    });
  }

  cancelar(): void {
    this.router.navigate(['/empresas']);
  }
}
