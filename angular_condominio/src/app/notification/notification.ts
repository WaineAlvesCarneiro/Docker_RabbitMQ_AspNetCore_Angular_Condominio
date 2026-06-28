import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from './services/notification-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notification$.subscribe(notification => {
      this.notifications.push(notification);
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n !== notification);
      }, 5000);
    });
  }

  close(notification: Notification): void {
    this.notifications = this.notifications.filter(n => n !== notification);
  }
}
