import { Component, inject  } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Auth } from './core/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
   auth = inject(Auth);
}
