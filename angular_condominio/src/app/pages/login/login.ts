import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/AuthService';
import { NotificationService } from '../../shared/modals/notification/services/notification-service';
import { AuthRedirectService } from '../../core/services/auth-redirect.service';
import { InputComponent } from '../../shared/components/input/input.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: false
})
export class Login implements OnInit, AfterViewInit {
  @ViewChild(InputComponent) usernameInput!: InputComponent;

  ngAfterViewInit(): void {
    if (this.usernameInput) {
      this.usernameInput.setFocus();
    }
  }
  
  form!: FormGroup;
  errorMessage: string | null = null;
  isLogging = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private authRedirectService: AuthRedirectService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });  
  };

  onSubmit() {
    this.isLogging = true;

    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe({
        next: (res) => {
          this.isLogging = false;
          const role = this.authService.getUserRole();
          const empresaId = this.authService.getUserEmpresaId();
          // Suporte não precisa estar vinculado a uma empresa (multi-tenant SaaS)
          const user = { ...res, role, empresaId: role === 'Suporte' ? null : empresaId };
          this.authRedirectService.redirectAfterLogin(user);
        },
        error: (err) => {
          this.isLogging = false;
          this.notificationService.showError('Credenciais inválidas. Tente novamente.');
          console.error(err);
        },
      });
    }
  }
}
