// import { Component, inject } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { AuthService } from '../../services/auth/auth.service';
// import { Router } from 'express';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-login',
//   imports: [RouterLink, FormsModule],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })
// export class LoginComponent {

//   email = '';
//   password = '';
//   errorMessage = '';


//   private authService = inject(AuthService);
//   private router = inject(Router);

//   login() {
//     const data = {
//       email: this.email,
//       password: this.password
//     };

//     this.authService.login(data).subscribe({
//       next: (res: any) => {
//         this.authService.saveAuth(res.token, res.user);
//         this.router.navigate(['/dashboard']);
//       },
//       error: (err) => {
//         this.errorMessage = err.error;
//       }
//     });
//   }
// }
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    const data = {
      email: this.email,
      password: this.password
    };

    this.authService.login(data).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error;
      }
    });
  }
}
