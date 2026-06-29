import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Supplier {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
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
export class SuppliersService {

  private baseUrl = 'https://localhost:7298/api/suppliers';

  constructor(private http: HttpClient) { }

  getAll(pageNumber: number, pageSize: number, search: string) {
    return this.http.get<any>(this.baseUrl, {
      params: {
        pageNumber,
        pageSize,
        search
      }
    });
  }

  add(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  update(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
