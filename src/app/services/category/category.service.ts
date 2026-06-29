import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Category {
  id: number;
  name: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7298/api/categories';

  getAll(pageNumber = 1, pageSize = 10, searchText = '') {

    return this.http.get<PagedResult<Category>>(
      `${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}&searchText=${searchText}`
    );

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

  getById(id: number) {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }
}
