import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {
    this.getAllCustomers();
    this.getProduct();
    this.getOrders();
  }
  http = inject(HttpClient);


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

  getOrders() {
    this.http.get<any[]>("https://localhost:7298/api/orders")
      .subscribe(result => {

        this.ordersCount = result.length;
      });
  }

}
