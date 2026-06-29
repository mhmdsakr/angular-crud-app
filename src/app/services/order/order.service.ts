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

  stock: number;
  isAvailable: boolean;

  categoryId: number;
  categoryName: string;

  supplierId: number;
  supplierName: string;

  mainImage?: string;
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

  createdById: string;
  createdByName: string;

  customer: Customer;
  items: OrderItem[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
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
  getCustomers(params?: any) {
    return this.http.get<PagedResult<Customer>>(
      `${this.baseUrl}/customers`,
      {
        params
      }
    );
  }

  getProducts() {
    return this.http.get<Product[]>(`${this.baseUrl}/product`);
  }


  // ================= Invoice =================

  downloadInvoice(id: number) {
    return this.http.get(
      `${this.baseUrl}/orders/${id}/invoice`,
      {
        responseType: 'blob'
      }
    );
  }
}
