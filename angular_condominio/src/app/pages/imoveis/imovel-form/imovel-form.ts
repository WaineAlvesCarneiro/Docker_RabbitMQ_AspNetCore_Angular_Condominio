import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../shared/modals/notification/services/notification-service';
import { Imovel } from '../imovel.model';
import { ImovelService } from '../services/imovel-service';
import { AuthService } from '../../../core/services/AuthService';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-imovel-form',
  standalone: false,
  templateUrl: './imovel-form.html',
  styleUrls: ['../../../../styles/_form.scss']
})
export class ImovelForm implements OnInit , AfterViewInit {
  @ViewChild(InputComponent) blocoInput!: InputComponent;
  
  ngAfterViewInit(): void {
    if (this.blocoInput) {
      this.blocoInput.setFocus();
    }
  }

  form!: FormGroup;
  isSaving = false;
  id?: string;
  formSubmetido = false;
  userRole: string | null = null;
  isPorteiro = false;

  constructor(
    private authService: AuthService,
    private imovelService: ImovelService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [{ value: 0, disabled: true }],
      bloco: ['', Validators.required],
      apartamento: ['', Validators.required],
      boxGaragem: ['', Validators.required]
    });

    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) this.carregar(this.id);

    this.userRole = this.authService.getUserRole();
    this.isPorteiro = this.userRole === 'Porteiro' || this.userRole === '3';
    if (this.userRole === 'Porteiro')
      this.form.disable();
  }

  carregar(id: string): void {
    this.imovelService.getId(id).subscribe({
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
    if (this.userRole === 'Porteiro') {
      this.notificationService.showAlerta('Visualização apenas. Porteiro não pode salvar.');
      return;
    }

    this.formSubmetido = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.notificationService.showAlerta('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const imovel: Imovel = {
      id: this.id ? this.id : '0',
      bloco: this.form.get('bloco')?.value,
      apartamento: this.form.get('apartamento')?.value,
      boxGaragem: this.form.get('boxGaragem')?.value
    };

    this.isSaving = true;

    const request = this.id 
      ? this.imovelService.atualizar({ ...imovel, id: this.id})
      : this.imovelService.criar(imovel);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.notificationService.showSuccess('Imóvel salvo com sucesso!');
        this.router.navigate(['/imoveis']);
      },
      error: (err) => {
        this.isSaving = false;
        this.notificationService.showError('Erro ao salvar usuário.');
        console.error(err);
      }
    });
  }

  cancelar(): void {
    this.formSubmetido = false;
    this.router.navigate(['/imoveis']);
  }
}