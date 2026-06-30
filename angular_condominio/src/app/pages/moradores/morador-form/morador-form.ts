import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Morador } from '../morador.model';
import { Imovel } from '../../imoveis/imovel.model';
import { MoradorService } from '../services/morador-service';
import { ImovelService } from '../../imoveis/services/imovel-service';
import { AuthService } from '../../../core/services/AuthService';
import { NotificationService } from '../../../shared/notification/services/notification-service';

@Component({
  selector: 'app-morador-form',
  standalone: false,
  templateUrl: './morador-form.html',
  styleUrls: ['./morador-form.css']
})
export class MoradorForm implements OnInit, AfterViewInit {
  @ViewChild('focusInput') focusInputRef!: ElementRef;

  ngAfterViewInit(): void {
    this.focusInputRef.nativeElement.focus();
  }

  form!: FormGroup;
  imoveis: Imovel[] = [];

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
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [{ value: 0, disabled: true }],
      nome: ['', Validators.required],
      celular: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email: ['', [Validators.required, Validators.email]],
      dataEntrada: ['', Validators.required],
      dataSaida: '',
      isProprietario: false,
      imovelId: ['', Validators.required]
    });

    this.imovelService.getAll().subscribe({
      next: (res) => this.imoveis = res.dados,
      error: () => this.notificationService.showError('Erro ao carregar imóvel.')
    });

    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) this.carregar(this.id);

    this.userRole = this.authService.getUserRole();
    this.isPorteiro = this.userRole === 'Porteiro' || this.userRole === '3';
    if (this.userRole === 'Porteiro')
      this.form.disable();
  }

  carregar(id: string): void {
    this.moradorService.getId(id).subscribe({
      next: (u) => {
        this.form.patchValue(u);
        this.form.get('passwordHash')?.clearValidators();
        this.form.get('passwordHash')?.updateValueAndValidity();
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
