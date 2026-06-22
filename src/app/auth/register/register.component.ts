import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink , FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  register() {

    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords don't match";
      return;
    }

    const data = {
      fullName: this.fullName,
      email: this.email,
      password: this.password
    };

    this.authService.register(data).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {

        const response = err.error;

        if (Array.isArray(response)) {
          this.errorMessage = response
            .map((e: any) => e.description)
            .join(' , ');
        }
        else if (typeof response === 'string') {
          this.errorMessage = response;
        }
        else {
          this.errorMessage = 'Something went wrong';
        }

      }
    });
  }
}
