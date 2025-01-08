import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading: boolean = false;

  constructor(private authService: AuthService) { }

  login() {
    this.isLoading = true;
    this.authService.login().finally(() => {
      this.isLoading = false;
    });
  }
}
