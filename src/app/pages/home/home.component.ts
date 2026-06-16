import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink, CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {
    this.getAllCustomers();
    this.getProduct();
    this.getOrders();

    this.role = this.authService.getUserRole();

  }
  http = inject(HttpClient);

  role: string | null = null;
  private authService = inject(AuthService)


  isAdmin(): boolean {
    return this.role === 'Admin';
  }

  isUser(): boolean {
    return this.role === 'User';

  }



  // ------------------------------- Customers------------------------------------------------
  customersCount = 0;

  getAllCustomers() {
    this.http.get<any[]>("https://localhost:7298/api/customers")
      .subscribe(
        result => {
          // this.customers = result;
          this.customersCount = result.length;
        }
      )
  }


  // ------------------------------- Products ------------------------------------------------
  productsCount = 0;

  getProduct() {
    this.http.get<any[]>("https://localhost:7298/api/product")
      .subscribe(result => {
        this.productsCount = result.length;
      });
  }

  // ------------------------------- Orders ------------------------------------------------
  ordersCount = 0;
  orders: any[] = [];

  // getOrders() {
  //   this.http.get<any[]>("https://localhost:7298/api/orders")
  //     .subscribe(result => {

  //       this.ordersCount = result.length;
  //     });
  // }
  getOrders() {
    this.http.get<any[]>("https://localhost:7298/api/orders")
      .subscribe(result => {

        const userId = this.authService.getUserId();
        const role = this.authService.getUserRole();

        // Admin → كل الأوردرات
        if (role === 'Admin') {
          this.orders = result;
        }
        // User → أوردراته فقط
        else {
          this.orders = result.filter(o => o.createdById === userId);
        }

        this.ordersCount = this.orders.length;
      });
  }

}
