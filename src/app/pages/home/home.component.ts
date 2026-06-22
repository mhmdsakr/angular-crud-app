import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {
    this.getAllCustomers();
    this.getProduct();
    this.getOrders();
    this.getUser();

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
  availableProductsCount = 0;
  unavailableProductsCount = 0;

  getProduct() {
    this.http.get<any[]>("https://localhost:7298/api/product")
      .subscribe(result => {

        this.productsCount = result.length;

        this.availableProductsCount =
          result.filter(x => x.isAvailable).length;

        this.unavailableProductsCount =
          result.filter(x => !x.isAvailable).length;

      });
  }

  // ------------------------------- Users ------------------------------------------------
  usersCount = 0;

  getUser() {
    this.http.get<any>("https://localhost:7298/api/users")
      .subscribe(result => {
        this.usersCount = result.totalCount;
      });
  }

  // ------------------------------- Orders ------------------------------------------------
  ordersCount = 0;

  revenue = 0;

  completedOrdersCount = 0;
  pendingOrdersCount = 0;

  completedRevenue = 0;
  pendingRevenue = 0;

  orders: any[] = [];

  getOrders() {

    this.http.get<any[]>("https://localhost:7298/api/orders")
      .subscribe(result => {

        const userId = this.authService.getUserId();
        const role = this.authService.getUserRole();

        // ================= FILTER =================
        if (role === 'Admin') {
          this.orders = result;
        } else {
          this.orders = result.filter(o => o.createdById === userId);
        }

        // ================= COUNTS =================
        this.ordersCount = this.orders.length;

        this.completedOrdersCount =
          this.orders.filter(o => o.status === true).length;

        this.pendingOrdersCount =
          this.orders.filter(o => o.status === false).length;

        // ================= REVENUE =================

        this.revenue = 0;
        this.completedRevenue = 0;
        this.pendingRevenue = 0;

        for (let order of this.orders) {

          this.revenue += order.totalAmount;

          if (order.status === true) {
            this.completedRevenue += order.totalAmount;
          } else {
            this.pendingRevenue += order.totalAmount;
          }
        }

      });
  }
}
