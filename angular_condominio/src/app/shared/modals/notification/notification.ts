import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from './services/notification-service';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  private subscriptionActive = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    if (!this.subscriptionActive) {
      this.subscriptionActive = true;
      this.notificationService.notification$.subscribe(notification => {
        this.notifications.push(notification);
        setTimeout(() => {
          this.notifications = this.notifications.filter(n => n !== notification);
        }, 5000);
      });
    }
  }

  close(notification: Notification): void {
    this.notifications = this.notifications.filter(n => n !== notification);
  }
}
