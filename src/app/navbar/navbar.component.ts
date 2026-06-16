import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  userName: string | null = null;
  role: string | null = null;

  constructor(private auth: AuthService) {
    this.userName = this.auth.getUserName();
    this.role = this.auth.getUserRole();
  }
}
