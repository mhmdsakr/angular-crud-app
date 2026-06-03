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

  // ================= DATA =================
  orders: Order[] = [];
  customers: Customer[] = [];
  products: Product[] = [];
  loading = false;
  errorMessage = '';

  searchValue = '';
  filteredOrders: Order[] = [];

  ngOnInit(): void {
    this.loadOrders();
    this.loadCustomers();
    this.loadProducts();
  }

  // ================= LOAD =================
  loadOrders() {
    this.loading = true;

    this.errorMessage = '';
    this.orderService.getOrders()
      // .subscribe(res => this.orders = res);
      .subscribe({

        next: (res) => {

          this.orders = res;
          this.filteredOrders = res;

          this.loading = false;

        },

        error: (err) => {

          console.log(err);

          this.loading = false;

          this.errorMessage = 'Failed To Load Orders';

        }

      })
  }

  filterOrders() {

    const value = this.searchValue.toLowerCase().trim();

    this.filteredOrders = this.orders.filter(o => {

      return (
        o.id.toString().includes(value) ||
        o.customer.name.toLowerCase().includes(value) ||
        (o.status ? 'done' : 'pending').includes(value)
      );

    });

  }

  loadCustomers() {
    this.orderService.getCustomers()
      .subscribe(res => this.customers = res);
  }

  loadProducts() {
    this.orderService.getProducts()
      .subscribe(res => this.products = res);
  }

  // ================= GET BY ID =================
  selectedOrder: Order | null = null;

  openOrder(id: number) {
    this.orderService.getOrderById(id)
      .subscribe(res => this.selectedOrder = res);
  }

  // ================= CREATE ORDER FORM =================
  showAddSuccess = false;

  orderForm = this.fb.group({
    customerId: [0, [Validators.required, Validators.min(1)]],
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

    this.orderService.createOrder(this.orderForm.value)
      .subscribe(() => {

        this.loadOrders();

        this.closeModal('addOrderModal');

        this.orderForm.reset({
          customerId: 0,
          status: false
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
}
