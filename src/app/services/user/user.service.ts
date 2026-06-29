import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
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
export class UserService {

  private baseUrl = 'https://localhost:7298/api/users';

  constructor(private http: HttpClient) { }

  getAllUsers(params: any): Observable<PagedResult<User>> {
    return this.http.get<PagedResult<User>>(this.baseUrl, {
      params
    });
  }

  createUser(data: any) {
    return this.http.post(
      `https://localhost:7298/api/auth/create-user`,
      data
    );
  }

  updateUser(id: string, data: any) {
    return this.http.put(
      `${this.baseUrl}/update-user/${id}`,
      data
    );
  }


}
