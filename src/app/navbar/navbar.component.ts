import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/CartService/cart-service.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private cartService = inject(CartService);

  ngOnInit(): void {

    this.cartService.cartCount$
      .subscribe(count => {
        this.cartCount = count;
      });

  }

  userName: string | null = null;
  role: string | null = null;
  cartCount = 0;

  constructor(private auth: AuthService) {
    this.userName = this.auth.getUserName();
    this.role = this.auth.getUserRole();
  }

  // loadCartCount() {

  //   const cart = JSON.parse(
  //     localStorage.getItem('cart') || '[]'
  //   );

  //   this.cartCount = cart.length;

  // }
}
