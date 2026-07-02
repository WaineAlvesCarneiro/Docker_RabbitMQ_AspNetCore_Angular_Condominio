import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Morador } from '../morador.model';
import { MoradorService } from '../services/morador-service';
import { ImovelService } from '../../imoveis/services/imovel-service';
import { AuthService } from '../../../core/services/AuthService';
import { NotificationService } from '../../../shared/modals/notification/services/notification-service';
import { SelectOption } from '../../../shared/components/select/select.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-morador-form',
  templateUrl: './morador-form.html',
  styleUrls: ['../../../../styles/_form.scss'],
  standalone: false,
})
export class MoradorForm implements OnInit, AfterViewInit {
  @ViewChild(InputComponent) nomeInput!: InputComponent;
  
  ngAfterViewInit(): void {
    if (this.nomeInput) {
      this.nomeInput.setFocus();
    }
  }

  getCelularError(): string {
    const c = this.form.get('celular');
    if (!c || !c.errors) return '';
    return c.errors['celularInvalid'] ? 'Celular inválido (11 dígitos).' : 'Celular obrigatório.';
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
  imoveis: any[] = [];
  imovelOptions: SelectOption[] = [];
  isSaving = false;
  id?: string;
  formSubmetido = false;
  userRole: string | null = null;
  isPorteiro = false;

  constructor(
    private authService: AuthService,
    private moradorService: MoradorService,
    private imovelService: ImovelService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {}

  private celularValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const raw = (control.value || '').toString();
      const digits = raw.replace(/\D/g, '');
      return digits.length === 11 ? null : { celularInvalid: true };
    };
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [{ value: 0, disabled: true }],
      nome: ['', Validators.required],
      celular: ['', [Validators.required, this.celularValidator()]],
      email: ['', [Validators.required, Validators.email]],
      dataEntrada: ['', Validators.required],
      dataSaida: '',
      isProprietario: false,
      imovelId: ['', Validators.required]
    });

    this.imovelService.getAll().subscribe({
      next: (res) => {
        this.imoveis = res;
        // usar string para value para consistência com o FormControl
        this.imovelOptions = this.imoveis.map(imovel => ({
          value: String(imovel.id),
          label: `Bloco ${imovel.bloco} - Apto ${imovel.apartamento}`
        }));
      },
      error: () => this.notificationService.showError('Erro ao carregar imóvel.')
    });

    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) this.carregar(this.id);

    this.userRole = this.authService.getUserRole();
    this.isPorteiro = this.userRole === 'Porteiro' || this.userRole === '3';
    if (this.userRole === 'Porteiro') this.form.disable();

    // garantir opções também como strings (caso imoveis já estejam carregados)
    this.imovelOptions = this.imoveis.map(imovel => ({
      value: String(imovel.id),
      label: `Bloco ${imovel.bloco} - Apto ${imovel.apartamento}`
    }));
  }

  carregar(id: string): void {
    this.moradorService.getId(id).subscribe({
      next: (u) => {
        // garantir que imovelId esteja como string para funcionar com <select>
        const patch = { ...u, imovelId: u.imovelId != null ? String(u.imovelId) : '' } as any;
        this.form.patchValue(patch);
      },
      error: (err) => {
        this.notificationService.showError('Erro ao carregar morador');
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

    const imovelSelecionado = this.imoveis.find(i => Number(i.id) === Number(this.form.get('imovelId')?.value));
    if (!imovelSelecionado) {
      this.notificationService.showAlerta('Imóvel inválido. Verifique o campo e tente novamente.');
      return;
    }

    const morador: Morador = {
      id: this.id ? this.id : '0',
      nome: this.form.get('nome')?.value,
      celular: this.form.get('celular')?.value,
      email: this.form.get('email')?.value,
      isProprietario: this.form.get('isProprietario')?.value,
      imovelId: Number(this.form.get('imovelId')?.value),
      dataEntrada: new Date(this.form.get('dataEntrada')?.value).toISOString(),
      dataSaida: this.form.get('dataSaida')?.value ? new Date(this.form.get('dataSaida')?.value).toISOString() : null,
      dataInclusao: new Date().toISOString(),
      dataAlteracao: Number(this.form.get('id')?.value) !== 0 ? new Date().toISOString() : null
    };

    this.isSaving = true;
    const obs = this.id
      ? this.moradorService.atualizar({ ...morador, id: this.id })
      : this.moradorService.criar(morador);

    obs.subscribe({
      next: () => {
        this.isSaving = false;
        this.notificationService.showSuccess('Usuário salvo com sucesso!');
        this.router.navigate(['/moradores']);
      },
      error: (err) => {
        this.isSaving = false;
        this.notificationService.showError('Erro ao salvar morador.');
        console.error(err);
      }
    });
  }

  cancelar(): void {
    this.formSubmetido = false;
    this.router.navigate(['/moradores']);
  }
}
