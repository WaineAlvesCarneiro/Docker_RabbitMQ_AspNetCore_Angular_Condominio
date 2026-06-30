import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { NotificationService } from '../../../shared/notification/services/notification-service';
import { AuthService } from '../../../core/services/AuthService';

@Component({
  selector: 'app-definir-senha',
  templateUrl: './definir-senha.html',
  standalone: false,
  styleUrls: ['./definir-form.css']
})
export class DefinirSenha implements OnInit, AfterViewInit {
  @ViewChild('focusInput') focusInputRef!: ElementRef;

  form!: FormGroup;
  errorMessage: string | null = null;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }
  
  ngAfterViewInit(): void {
    this.focusInputRef.nativeElement.focus();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      novaSenha: ['', [Validators.required, Validators.minLength(5)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  };

  onSubmit(): void {
    this.isSaving = true;

    if (this.form.valid) {
      this.authService.definirSenha(this.form.value.novaSenha).subscribe({
        next: () => {
          this.isSaving = false;
          this.notificationService.showSuccess('Senha definida com sucesso. Faça login com a nova senha.');
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isSaving = false;
          this.notificationService.showError('Erro ao definir senha.');
          console.error(err);
        },
          complete: () => {
            this.isSaving = false;
          }
      });
    }
  }

  private passwordsMatch(control: AbstractControl) {
    const nova = control.get('novaSenha')?.value;
    const confirmar = control.get('confirmarSenha')?.value;
    if (nova && confirmar && nova !== confirmar) {
      return { passwordMismatch: true };
    }    

    return null;
  }
}
