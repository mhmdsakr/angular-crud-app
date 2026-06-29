import { Component, inject, OnInit } from '@angular/core';
import { CustomersService } from '../../services/customers/customers.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

declare var bootstrap: any;

export interface Customer {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  ordersCount?: number;
}
@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {


  ngOnInit(): void {

    this.loadCustomers();

  }

  customerService = inject(CustomersService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);


  customers: Customer[] = [];
  defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  loading = false;
  errorMessage = '';
  searchText = '';
  pageNumber = 1;
  pageSize = 9;
  totalCount = 0;
  showSuccess = false;
  showUpdateSuccess = false;
  showDeleteSuccess = false;

  // ================= ROLES =================
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
  // ---------------------------------- search -------------------------------------
  onSearchChange() {

    this.pageNumber = 1;

    this.loadCustomers();

  }

  // ---------------------------------- paginate -------------------------------------
  changePage(page: number) {

    if (page < 1 || page > this.totalPages)
      return;

    this.pageNumber = page;

    this.loadCustomers();

  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  // ---------------------------------- Get All -------------------------------------
  loadCustomers() {

    this.loading = true;

    this.customerService.getCustomers({

      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      search: this.searchText

    })
      .subscribe({

        next: (res) => {

          this.customers = res.items;

          this.totalCount = res.totalCount;

          this.loading = false;

        },

        error: () => {

          this.loading = false;

          this.errorMessage = 'Failed To Load Customers';

        }

      });

  }


  // ---------------------------------- Add -------------------------------------
  addForm = this.fb.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150)
      ]
    ],

    phone: [
      '',
      [
        Validators.maxLength(20)
      ]
    ],

    email: [
      '',
      [
        Validators.email,
        Validators.maxLength(150)
      ]
    ],

    address: [
      '',
      [
        Validators.maxLength(300)
      ]
    ]

  });


  addCustomer() {

    if (this.addForm.invalid) {

      this.addForm.markAllAsTouched();

      return;

    }

    this.customerService.createCustomer(
      this.addForm.getRawValue() as Customer
    )
      .subscribe({

        next: () => {

          this.loadCustomers();

          this.showSuccess = true;

          this.closeModal('addModal');

          this.addForm.reset();

          this.addForm.patchValue({

            name: '',
            phone: '',
            email: '',
            address: ''

          });

          setTimeout(() => {
            this.showSuccess = false;
          }, 5000);

        },

        error: err => {

          alert(
            err.error?.message ??
            'Something went wrong'
          );

        }

      });

  }


  // ---------------------------------- Edit -------------------------------------
  selectedCustomer!: Customer;
  selectedCustomerId = 0;

  editForm = this.fb.group({

    name: ['',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150)
      ]],

    phone: [''],

    email: ['',
      [
        Validators.email
      ]],

    address: ['']

  });

  openEdit(id: number) {

    this.customerService
      .getCustomerById(id)
      .subscribe(res => {

        this.selectedCustomerId = id;

        this.editForm.patchValue(res);

        new bootstrap.Modal(
          document.getElementById('editModal')
        ).show();

      });

  }

  updateCustomer() {

    if (this.editForm.invalid)
      return;

    this.customerService.updateCustomer(

      this.selectedCustomerId,

      this.editForm.getRawValue() as any

    )

      .subscribe(() => {

        this.closeModal('editModal');

        this.loadCustomers();

        this.showUpdateSuccess = true;

        setTimeout(() => {

          this.showUpdateSuccess = false;

        }, 5000);

      });

  }

  // ---------------------------------- Delete -------------------------------------
  openDelete(customer: Customer) {

    this.selectedCustomer = customer;

    this.selectedCustomerId = customer.id;

    new bootstrap.Modal(
      document.getElementById('deleteModal')
    ).show();

  }

  deleteCustomer() {

    this.customerService
      .deleteCustomer(this.selectedCustomerId)

      .subscribe({

        next: () => {

          this.closeModal('deleteModal');

          this.loadCustomers();

          this.showDeleteSuccess = true;

          setTimeout(() => {

            this.showDeleteSuccess = false;

          }, 5000);

        },

        error: (err) => {

          alert(

            err.error?.message ??

            err.error ??

            'Cannot delete customer'

          );

        }

      });

  }

  // ---------------------------------- Helper -------------------------------------
  closeModal(id: string) {

    const modal = document.getElementById(id);

    if (!modal)
      return;

    const instance = bootstrap.Modal.getInstance(modal);

    instance?.hide();

  }

}
