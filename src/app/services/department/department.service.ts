import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Department {
  id: number;
  name: string;
  studentsCount: number;
}

export interface DepartmentQuery {
  search?: string;
  pageNumber: number;
  pageSize: number;
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
export class DepartmentService {



  private baseUrl = 'https://localhost:7298/api/departments';

  constructor(private http: HttpClient) { }

  getAll(params: DepartmentQuery): Observable<PagedResult<Department>> {

    return this.http.get<PagedResult<Department>>(
      this.baseUrl,
      {
        params: {
          search: params.search ?? '',
          pageNumber: params.pageNumber,
          pageSize: params.pageSize
        }
      }
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
    return this.http.get(`${this.baseUrl}/${id}`);
  }

}
