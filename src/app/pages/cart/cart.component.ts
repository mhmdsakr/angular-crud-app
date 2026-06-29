import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/CartService/cart-service.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];
  defaultImage = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c';
  apiUrl = 'https://localhost:7298';

  private orderService = inject(OrderService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  successMessage = '';

  customers: any[] = [];

  selectedCustomerId = 0;

  paymentMethod = 'cash';

  ngOnInit(): void {
    this.loadCart();
    this.loadCustomers();
  }

  loadCart() {
    this.cartItems = JSON.parse(
      localStorage.getItem('cart') || '[]'
    );
  }

  loadCustomers() {
    this.orderService.getCustomers({ pageNumber: 1, pageSize: 1000, search: '' })
      .subscribe(res => {
        this.customers = res.items;
      });
  }

  // SAVE helper
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  // increase qty
  increase(item: any) {

    if (item.quantity >= item.stock) {
      this.showError(`Only ${item.stock} items available`);
      return;
    }

    item.quantity++;

    this.saveCart();

    this.cartService.refreshCartCount();
  }

  // decrease qty
  decrease(item: any) {

    if (item.quantity <= 1) return;

    item.quantity--;
    this.saveCart();
    this.cartService.refreshCartCount();
  }

  // delete item
  removeItem(productId: number) {

    this.cartItems = this.cartItems.filter(
      x => x.productId !== productId
    );

    this.saveCart();
    this.cartService.refreshCartCount();
  }

  // totals
  get subTotal(): number {
    return this.cartItems.reduce((sum, item) =>
      sum + (item.price * item.quantity), 0);
  }

  get discount(): number {
    return 0;
  }

  get total(): number {
    return this.subTotal - this.discount;
  }

  // Create Order
  createOrder() {

    if (this.selectedCustomerId <= 0) {
      this.showError('Please select a customer first');
      return;
    }

    if (this.cartItems.length === 0) {
      this.showError('Your cart is empty');
      return;
    }

    const order = {

      customerId: this.selectedCustomerId,

      createdById: this.authService.getUserId(),

      status: false,

      items: this.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(order)
      .subscribe({

        next: () => {

          localStorage.removeItem('cart');

          this.cartItems = [];

          this.selectedCustomerId = 0;

          this.showSuccess('Order created successfully');

          this.cartService.refreshCartCount();

          setTimeout(() => {
            this.router.navigate(['/orders']);
          }, 2000);
        },

        error: (err) => {

          this.showError(
            err.error || 'Something went wrong while creating the order'
          );

        }

      });



  }


  //  helper messages
  showError(message: string) {

    this.errorMessage = message;

    setTimeout(() => {
      this.errorMessage = '';
    }, 4000);

  }

  showSuccess(message: string) {

    this.successMessage = message;

    setTimeout(() => {
      this.successMessage = '';
    }, 4000);

  }
}
