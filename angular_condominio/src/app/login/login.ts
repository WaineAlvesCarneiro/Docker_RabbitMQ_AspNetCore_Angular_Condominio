import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/AuthService';
import { AuthRedirectService } from '../core/services/auth-redirect.service';
import { NotificationService } from '../notification/services/notification-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: false
})
export class Login implements OnInit, AfterViewInit {
  @ViewChild('focusInput') focusInputRef!: ElementRef;
  
  form!: FormGroup;
  errorMessage: string | null = null;
  isLogging = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private authRedirectService: AuthRedirectService
  ) {
  }

  ngAfterViewInit(): void {
    this.focusInputRef.nativeElement.focus();
  }

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
          const user = { ...res, role, empresaId };
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
