import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

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

  mainImage?: string | null;
  galleryImages?: string[] | null;
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
export class ProductService {

  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7298/api/product';

  getAll(pageNumber = 1, pageSize = 6, searchText: string = '') {

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (searchText?.trim()) {
      params = params.set('searchText', searchText.trim());
    }

    return this.http.get<any>(this.baseUrl, { params });
  }

  add(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  uploadImage(file: File) {

    const formData = new FormData();

    formData.append('file', file);

    return this.http.post(
      `${this.baseUrl}/upload`,
      formData,
      {
        responseType: 'text'
      }
    );
  }

  update(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }


  //needed data
  getSuppliers() {
    return this.http.get<PagedResult<any>>('https://localhost:7298/api/suppliers');
  }

  getCategories() {
    return this.http.get<PagedResult<any>>('https://localhost:7298/api/categories');
  }
}
