import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id: number;
  name: string;
  nativeName: string;
  departmentName: string;
  // departmentId: number;
  departmentId?: number | null;
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
export class StudentService {

  private baseUrl = 'https://localhost:7298/api';

  constructor(private http: HttpClient) { }

  // students
  getAll(params: any): Observable<PagedResult<Student>> {
    return this.http.get<PagedResult<Student>>(`${this.baseUrl}/students`, {
      params
    });
  }

  add(data: any) {
    return this.http.post(`${this.baseUrl}/students`, data);
  }


  update(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/students/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/students/${id}`);
  }

  // departments
  getDepartments() {
    return this.http.get<any>(`${this.baseUrl}/departments`);
  }
}
