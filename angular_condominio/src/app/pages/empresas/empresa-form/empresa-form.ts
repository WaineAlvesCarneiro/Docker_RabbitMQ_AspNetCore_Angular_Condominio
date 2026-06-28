import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empresa } from '../empresa.model';
import { EmpresaService } from '../services/empresa-service';
import { NotificationService } from '../../../notification/services/notification-service';
import { EnumService } from '../../../shared/services/enum.service';
import { buscarCep } from '../../../shared/utils/cep-utils';
import { isCnpjValid } from '../../../shared/validate/cnpj-validate';

@Component({
  selector: 'app-empresa-form',
  templateUrl: './empresa-form.html',
  standalone: false,
  styleUrls: ['./empresa-form.css']
})
export class EmpresaForm implements OnInit, AfterViewInit {
  @ViewChild('focusInput') focusInputRef!: ElementRef;

  ngAfterViewInit(): void {
    this.focusInputRef.nativeElement.focus();
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

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [{ value: 0, disabled: true }],
      ativo: ['0', Validators.required],
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
      porta: ['587', Validators.required],
      cep: [''],
      uf: [''],
      cidade: [''],
      endereco: [''],
      bairro: [''],
      complemento: [null]
    });

    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) this.carregar(this.id);
  
    this.enumService.getTipoCondominioArray().subscribe(options => this.tiposDeCondominio = options);
    this.enumService.getTipoEmpresaAtivoArray().subscribe(options => this.tiposEmpresaAtivo = options);
    
    this.form.get('cep')?.valueChanges.subscribe((cep: string) => {
      const somenteDigitos = cep.replace(/\D/g, '');
      if (somenteDigitos.length === 8) {
        this.buscarCep(somenteDigitos);
      }
    });
  }

  carregar(id: string): void {
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
      razaoSocial: this.form.get('razaoSocial')?.value,
      fantasia: this.form.get('fantasia')?.value,
      cnpj: this.form.get('cnpj')?.value,
      tipoDeCondominio: Number(this.form.get('tipoDeCondominio')?.value),
      nome: this.form.get('nome')?.value,
      celular: this.form.get('celular')?.value,
      telefone: this.form.get('telefone')?.value,
      email: this.form.get('email')?.value,
      senha: this.form.get('senha')?.value,
      host: this.form.get('host')?.value,
      porta: Number(this.form.get('porta')?.value),
      cep: this.form.get('cep')?.value,
      uf: this.form.get('uf')?.value,
      cidade: this.form.get('cidade')?.value,
      endereco: this.form.get('endereco')?.value,
      bairro: this.form.get('bairro')?.value,
      complemento: this.form.get('complemento')?.value,
      dataInclusao: new Date().toISOString(),
      dataAlteracao: Number(this.form.get('id')?.value) !== 0 ? new Date().toISOString() : null
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
