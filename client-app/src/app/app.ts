
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from './components/toast/toast';  
import { AuthService } from './services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Toast, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'product-app';
  constructor(public authService: AuthService) {} 
  logout() {
    this.authService.logout();
  }
}