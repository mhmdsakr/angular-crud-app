import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-landing',
  imports: [RouterLink, CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

  private authService = inject(AuthService);

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
