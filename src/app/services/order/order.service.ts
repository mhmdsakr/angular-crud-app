import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Customer {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  isAvailable: boolean;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  total: number;
  product: Product;
}

export interface Order {
  id: number;
  customerId: number;
  orderDate: string;
  status: boolean;
  totalAmount: number;

  customer: Customer;
  items: OrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);

  private baseUrl = 'https://localhost:7298/api';

  // ================= ORDERS =================
  getOrders() {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`);
  }

  getOrderById(id: number) {
    return this.http.get<Order>(`${this.baseUrl}/orders/${id}`);
  }

  createOrder(data: any) {
    return this.http.post(`${this.baseUrl}/orders`, data);
  }

  updateOrderStatus(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/orders/${id}/status`, data);
  }

  deleteOrder(id: number) {
    return this.http.delete(`${this.baseUrl}/orders/${id}`);
  }

  // ================= LOOKUPS =================
  getCustomers() {
    return this.http.get<Customer[]>(`${this.baseUrl}/customers`);
  }

  getProducts() {
    return this.http.get<Product[]>(`${this.baseUrl}/product`);
  }
}
