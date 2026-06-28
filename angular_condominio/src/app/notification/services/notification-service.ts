import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'alert';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notification$ = this.notificationSubject.asObservable();

  showSuccess(message: string): void {
    this.notificationSubject.next({ type: 'success', message });
  }

  showError(message: string): void {
    this.notificationSubject.next({ type: 'error', message });
  }

  showAlerta(message: string): void {
    this.notificationSubject.next({ type: 'alert', message });
  }
}
