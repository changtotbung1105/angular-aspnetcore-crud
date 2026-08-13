import { Injectable, signal  } from '@angular/core';

export interface Toast{
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
 toasts = signal<Toast[]>([]);
  private nextId = 0;


  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }
  
  private show(message: string, type: 'success' | 'error' | 'info') {
    const id = this.nextId++;
    const toast: Toast = { id, message, type };
    this.toasts.set([...this.toasts(), toast]);
    //this.toasts.update(toasts => [...toasts, toast]);
    console.log('Toast list hiện tại:', this.toasts());
    setTimeout(() => this.dismiss(id), 4000);
  }

  dismiss(id: number) {
    this.toasts.set(this.toasts().filter(t => t.id !== id));
  }
  
}
    