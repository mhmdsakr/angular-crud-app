import { Component, inject, OnInit } from '@angular/core';
import { User, UserService, PagedResult } from '../../services/user/user.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-users',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule],
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

  private fb = inject(FormBuilder);
  private userService = inject(UserService)

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


  // ================= Add Users =================
  closeModal(id: string) {

    const modalElement = document.getElementById(id);

    const modal = bootstrap.Modal.getInstance(
      modalElement
    );

    modal?.hide();
  }

  showSuccess = false;


  userForm = this.fb.group({
    fullName: ['', Validators.required],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ],

    role: [
      '',
      Validators.required
    ]
  });

  addUser() {

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.userService
      .createUser(this.userForm.value)
      .subscribe({

        next: () => {

          this.loadUsers();

          this.closeModal('addModal');

          this.userForm.reset();

          this.showSuccess = true;

          setTimeout(() => {
            this.showSuccess = false;
          }, 5000);
        },

        error: (err) => {
          console.log(err);
        }
      });


    this.userForm.reset({
      fullName: '',
      email: '',
      password: '',
      role: ''
    });
  }

  // ================= Edit Users =================
  editUserId = '';

  editForm = this.fb.group({

    fullName: ['', Validators.required],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [''],

    role: [
      '',
      Validators.required
    ]

  });

  openEdit(user: User) {

    this.editUserId = user.id;

    this.editForm.patchValue({

      fullName: user.fullName,

      email: user.email,

      password: '',

      role: user.roles.length ? user.roles[0] : 'User'

    });

  }


  updateUser() {

    if (this.editForm.invalid)
      return;

    this.userService
      .updateUser(
        this.editUserId,
        this.editForm.value
      )
      .subscribe({

        next: () => {

          this.loadUsers();

          this.closeModal('editModal');

        }

      });

  }


  // ================= ROLES =================
  private authService = inject(AuthService);
  role = this.authService.getUserRole();

  isSuper() {
    return this.role === 'SuperAdmin';
  }

  isAdmin() {
    return this.role === 'Admin';
  }

  isUser() {
    return this.role === 'User';
  }


}

