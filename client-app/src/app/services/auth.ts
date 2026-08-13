import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap  } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface AuthResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`; // URL của API
  private tokenKey = 'auth_token';

  // Signal lưu trạng thái đăng nhập, khởi tạo từ localStorage (nếu đã đăng nhập trước đó)
  currentUser = signal<string | null>(localStorage.getItem('auth_username'));

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem('auth_username', response.username);
        this.currentUser.set(response.username);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('auth_username');
    this.currentUser.set(null);
  }

    getToken(): string | null {
      return localStorage.getItem(this.tokenKey);
    }

    isLoggedIn(): boolean {
      return !!this.getToken();
    }
}