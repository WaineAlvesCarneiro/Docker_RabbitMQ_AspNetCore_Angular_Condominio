import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Empresa } from '../empresa.model';
import { EmpresaService } from '../services/empresa-service';
import { EnumService } from '../../../shared/services/enum.service';
import { buscarCep } from '../../../shared/utils/cep-utils';
import { isCnpjValid } from '../../../shared/validate/cnpj-validate';
import { NotificationService } from '../../../shared/modals/notification/services/notification-service';
import { InputComponent } from '../../../shared/components/input/input.component';

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

  getCelularError(): string {
    const c = this.form.get('celular');
    if (!c || !c.errors) return '';
    return c.errors['celularInvalid'] ? 'Celular inválido (11 dígitos).' : 'Celular obrigatório.';
  }

  // DEBUG: botão temporário para inspecionar estado do formulário
  logForm(): void {
    console.log('form.valid:', this.form.valid);
    console.log('form.value:', this.form.getRawValue());
    Object.keys(this.form.controls).forEach(k => {
      const c: any = this.form.get(k);
      console.log(k, 'valid=', c?.valid, 'value=', c?.value, 'errors=', c?.errors);
    });
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
  ) {}

  private celularValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const raw = (control.value || '').toString();
      const digits = raw.replace(/\D/g, '');
      return digits.length === 11 ? null : { celularInvalid: true };
    };
  }

  async ngOnInit(): Promise<void> {
    this.form = this.fb.group({
      id: [{ value: 0, disabled: true }],
      ativo: [0, Validators.required],
      razaoSocial: ['', Validators.required],
      fantasia: ['', Validators.required],
      cnpj: ['', Validators.required],
      tipoDeCondominio: [0, Validators.required],
      nome: ['', Validators.required],
      celular: ['', [Validators.required, this.celularValidator()]],
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
      id: this.id ? this.id : '0',
      ativo: Number(this.form.get('ativo')?.value),
      tipoDeCondominio: Number(this.form.get('tipoDeCondominio')?.value),
      razaoSocial: this.form.get('razaoSocial')?.value,
      fantasia: this.form.get('fantasia')?.value,
      cnpj: String(this.form.get('cnpj')?.value).replace(/\D/g, ''),
      nome: this.form.get('nome')?.value,
      celular: String(this.form.get('celular')?.value).replace(/\D/g, ''),
      telefone: this.form.get('telefone')?.value ? String(this.form.get('telefone')?.value).replace(/\D/g, '') : null,
      email: this.form.get('email')?.value,
      senha: this.form.get('senha')?.value,
      host: this.form.get('host')?.value,
      porta: this.form.get('porta')?.value,
      cep: String(this.form.get('cep')?.value).replace(/\D/g, ''),
      uf: this.form.get('uf')?.value,
      cidade: this.form.get('cidade')?.value,
      endereco: this.form.get('endereco')?.value,
      bairro: this.form.get('bairro')?.value,
      complemento: this.form.get('complemento')?.value,
      dataInclusao: new Date().toISOString(),
      dataAlteracao: this.form.get('id')?.value !== 0 ? new Date().toISOString() : null
    };

    this.isSaving = true;
    
    const request = this.id
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
