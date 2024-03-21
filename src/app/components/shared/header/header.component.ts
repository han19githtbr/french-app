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

  constructor(private router: Router) { }


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
