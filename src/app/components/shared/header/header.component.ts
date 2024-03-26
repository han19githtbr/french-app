import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchQuery: string = '';
  showHomeLabel: boolean = false;
  showOuvirLabel: boolean = false;
  showFalarLabel: boolean = false;
  notificationCount: number = 0;
  showNotifications: boolean = false;
  notifications: string[] = [];

  constructor(private router: Router) { }


  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.notificationCount = 0;
    }
  }

  addNotification(message: string) {
    this.notificationCount++;
    this.notifications.push(message);
  }

  clearNotifications() {
    this.notificationCount = 0;
    this.notifications = [];
  }

  showLabel(label: string) {
    switch (label) {
      case 'home':
        this.showHomeLabel = true;
        this.showOuvirLabel = false;
        this.showFalarLabel = false;
        break;
      case 'ouvir':
        this.showHomeLabel = false;
        this.showOuvirLabel = true;
        this.showFalarLabel = false;
        break;
      case 'falar':
        this.showHomeLabel = false;
        this.showOuvirLabel = false;
        this.showFalarLabel = true;
        break;
      default:
        this.showHomeLabel = false;
        this.showOuvirLabel = false;
        this.showFalarLabel = false;
        break;
    }
  }
}
