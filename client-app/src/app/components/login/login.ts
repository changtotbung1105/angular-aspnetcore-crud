import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login {
  form: FormGroup;
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }   

  submit() {
    if (this.form.invalid) {
      this.errorMessage.set('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const { username, password } = this.form.value;
    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(username, password).subscribe({
      next: (response) => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_username', response.username);
        this.authService.currentUser.set(response.username);
        this.router.navigate(['/products']);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Tên đăng nhập hoặc mật khẩu không đúng.');
      }
    });
  }   
}
