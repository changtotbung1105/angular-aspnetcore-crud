import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { RegisterDto , LoginDto, AuthResponseDto} from '../shared/models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = `${environment.apiUrl}/api/auth`;

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USERNAME_KEY = 'auth_username';

  currentUsername = signal<string | null>(localStorage.getItem(this.USERNAME_KEY));
  isLoggedIn = signal<boolean>(!!localStorage.getItem(this.TOKEN_KEY));

  register(dto: RegisterDto) {
    return this.http.post(`${this.baseUrl}/register`, dto, { responseType: 'text' });
  }

  login(dto: LoginDto) {

    return this.http
      .post(`${this.baseUrl}/login`, dto, { responseType: 'text' })
      .pipe(
        map((raw) => JSON.parse(raw) as AuthResponseDto),
        map((res) => {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          localStorage.setItem(this.USERNAME_KEY, res.username);
          this.currentUsername.set(res.username);
          this.isLoggedIn.set(true);
          return res;
        })
      );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    this.currentUsername.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}