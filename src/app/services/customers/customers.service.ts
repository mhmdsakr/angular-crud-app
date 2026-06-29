
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Customer {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  ordersCount?: number;
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
export class CustomersService {

  private http = inject(HttpClient);

  private baseUrl = 'https://localhost:7298/api/customers';

  // ================= GET ALL =================

  getCustomers(params: any) {
    return this.http.get<PagedResult<Customer>>(
      this.baseUrl,
      {
        params
      }
    );
  }

  // ================= GET BY ID =================

  getCustomerById(id: number) {
    return this.http.get<Customer>(
      `${this.baseUrl}/${id}`
    );
  }

  // ================= CREATE =================

  createCustomer(customer: Customer) { return this.http.post( this.baseUrl, customer );
  }

  // ================= UPDATE =================

  updateCustomer(
    id: number,
    customer: Customer
  ) {
    return this.http.put(
      `${this.baseUrl}/${id}`,
      customer
    );
  }

  // ================= DELETE =================

  deleteCustomer(id: number) {
    return this.http.delete(
      `${this.baseUrl}/${id}`
    );
  }

}
