import { Component, OnInit } from '@angular/core';
import { User, UserService, PagedResult } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  loading = false;
  errorMessage = '';

  // SEARCH + PAGINATION
  search = '';
  pageNumber = 1;
  pageSize = 9;
  totalCount = 0;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // ================= LOAD =================
  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getAllUsers({
      search: this.search,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    }).subscribe({
      next: (res: PagedResult<User>) => {
        this.users = res.items;
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load users';
        this.loading = false;
      }
    });
  }

  // ================= SEARCH =================
  onSearchChange(): void {
    this.pageNumber = 1;
    this.loadUsers();
  }

  // ================= PAGINATION =================
  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.pageNumber = page;
    this.loadUsers();
  }
}
