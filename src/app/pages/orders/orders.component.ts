import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormArray,
  FormsModule
} from '@angular/forms';

import { OrderService, Order, Customer, Product } from '../../services/order/order.service';
import { AuthService } from '../../services/auth/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  private orderService = inject(OrderService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  // ================= DATA =================

  orders: Order[] = [];
  customers: Customer[] = [];
  products: Product[] = [];
  loading = false;
  errorMessage = '';

  searchValue = '';
  filteredOrders: Order[] = [];

  pageNumber = 1;
  pageSize = 6;

  get pagedOrders() {
    const start = (this.pageNumber - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredOrders.length / this.pageSize);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
    }
  }

  ngOnInit(): void {
    this.loadOrders();
    this.loadCustomers();
    this.loadProducts();
  }

  // ================= LOAD =================
  loadOrders() {
    this.loading = true;
    this.errorMessage = '';

    const userId = this.authService.getUserId();
    const role = this.authService.getUserRole();

    this.orderService.getOrders().subscribe({
      next: (res) => {

        // ================= SUPER ADMIN & ADMIN =================
        if (role === 'SuperAdmin' || role === 'Admin') {

          this.orders = res;
          this.filteredOrders = res;

        }

        // ================= USER =================
        else if (role === 'User') {

          this.orders = res.filter(o => o.createdById === userId);
          this.filteredOrders = this.orders;

        }

        // ================= UNKNOWN ROLE =================
        else {

          this.orders = [];
          this.filteredOrders = [];

        }

        this.loading = false;

      },

      error: (err) => {
        console.log(err);
        this.loading = false;
        this.errorMessage = 'Failed To Load Orders';
      }
    });
  }

  filterOrders() {
    const value = this.searchValue.toLowerCase().trim();

    this.filteredOrders = this.orders.filter(o => {
      return (
        o.id.toString().includes(value) ||
        o.customer.name.toLowerCase().includes(value) ||
        (o.status ? 'completed' : 'pending').includes(value)||
        o.createdByName.toLocaleLowerCase().includes(value)
      );
    });

    this.pageNumber = 1; // مهم جدًا
  }

  loadCustomers() {
    this.orderService.getCustomers({
      pageNumber: 1,
      pageSize: 1000,
      search: ''
    }).subscribe(res => {

      this.customers = res.items;

    });
  }

  loadProducts() {
    this.orderService.getProducts()
      .subscribe(res => this.products = res);
  }

  // ================= GET BY ID =================
  selectedOrder: Order | null = null;

  openOrder(id: number) {
    this.orderService.getOrderById(id)
      .subscribe(res => {
        // console.log(res);
        this.selectedOrder = res;
      });
  }

  // ================= CREATE ORDER FORM =================

  showAddSuccess = false;

  orderForm = this.fb.group({
    customerId: [0, [Validators.required, Validators.min(1)]],
    createdById: [''],
    status: [false],
    items: this.fb.array([this.createItem()])
  });

  createItem() {
    return this.fb.group({
      productId: [0, [Validators.required, Validators.min(1)]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    if (this.items.length === 1) return;
    this.items.removeAt(index);
  }

  addOrder() {

    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const userId = this.authService.getUserId();
    this.orderForm.patchValue({
      createdById: userId
    });

    this.orderService.createOrder(this.orderForm.value)
      .subscribe(() => {

        this.loadOrders();

        this.closeModal('addOrderModal');

        this.orderForm.reset({
          customerId: 0,
          status: false,
          createdById: ''
        });

        this.items.clear();
        this.items.push(this.createItem());

        this.showAddSuccess = true;
        setTimeout(() => this.showAddSuccess = false, 5000);
      });
  }

  // ================= STATUS =================
  selectedStatusOrder: Order | null = null;
  showStatusSuccess = false;

  statusForm = this.fb.group({
    status: [false, Validators.required]
  });

  openStatusModal(o: Order) {
    console.log('OPEN STATUS', o);

    this.selectedStatusOrder = o;

    this.statusForm.setValue({
      status: o.status
    });
  }

  updateStatus() {

    if (!this.selectedStatusOrder) return;

    this.orderService.updateOrderStatus(
      this.selectedStatusOrder.id,
      this.statusForm.value
    ).subscribe(() => {

      this.loadOrders();

      this.closeModal('statusModal');

      this.selectedStatusOrder = null;

      this.showStatusSuccess = true;
      setTimeout(() => this.showStatusSuccess = false, 5000);
    });
  }

  // ================= DELETE =================
  deleteOrderId: number | null = null;
  deleteOrderRef: Order | null = null;

  showDeleteSuccess = false;

  openDelete(o: Order) {
    this.deleteOrderId = o.id;
    this.deleteOrderRef = o;
  }

  confirmDelete() {

    if (!this.deleteOrderId) return;

    this.orderService.deleteOrder(this.deleteOrderId)
      .subscribe(() => {

        this.loadOrders();

        this.closeModal('deleteOrderModal');

        this.deleteOrderId = null;
        this.deleteOrderRef = null;

        this.showDeleteSuccess = true;
        setTimeout(() => this.showDeleteSuccess = false, 5000);
      });
  }

  // ================= helper =================
  closeModal(id: string) {
    const modalElement = document.getElementById(id);
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  }



  // ================= Download Invoice =================

  downloadInvoice(id: number) {

    this.orderService.downloadInvoice(id).subscribe({

      next: (blob) => {

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;

        link.download = `INV-${id.toString().padStart(6, '0')}.pdf`;

        link.click();

        window.URL.revokeObjectURL(url);

      },

      error: () => {

        alert('Failed to download invoice.');

      }

    });

  }

  // ================= Roles =================
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
