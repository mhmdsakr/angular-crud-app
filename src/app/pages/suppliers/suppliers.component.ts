import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SuppliersService, Supplier } from '../../services/suppliers/suppliers.service';

declare var bootstrap: any;

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css'
})
export class SuppliersComponent implements OnInit {

  private service = inject(SuppliersService);
  private fb = inject(FormBuilder);

  suppliers: Supplier[] = [];

  searchText = '';
  loading = false;
  errorMessage = '';

  pageNumber = 1;
  pageSize = 6;
  totalCount = 0;

  // ================= INIT =================
  ngOnInit(): void {
    this.loadSuppliers();
  }

  // ================= LOAD =================
  loadSuppliers() {
    this.loading = true;

    this.service.getAll(
      this.pageNumber,
      this.pageSize,
      this.searchText
    ).subscribe({
      next: (res) => {
        console.log(res);
        this.suppliers = res.items;
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to load suppliers';
      }
    });
  }

  // ================= SEARCH =================
  onSearchChange() {
    this.pageNumber = 1;
    this.loadSuppliers();
  }

  // ================= PAGINATION =================
  get totalPages() {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
    this.loadSuppliers();
  }

  // ================= ADD FORM =================
  supplierForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    phone: [''],
    email: ['', [Validators.email]],
    address: ['']
  });

  showSuccess = false;

  addSupplier() {
    this.supplierForm.markAllAsTouched();

    if (this.supplierForm.invalid) return;

    this.service.add(this.supplierForm.value)
      .subscribe(() => {

        this.loadSuppliers();
        this.resetAddForm();

        this.showSuccess = true;
        this.closeModal('addModal');

        setTimeout(() => this.showSuccess = false, 3000);
      });
  }

  resetAddForm() {
    this.supplierForm.reset();
    this.supplierForm.markAsPristine();
    this.supplierForm.markAsUntouched();
  }

  // ================= EDIT FORM =================
  editForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    phone: [''],
    email: ['', [Validators.email]],
    address: ['']
  });

  editId = 0;
  showUpdateSuccess = false;

  openEdit(s: Supplier) {
    this.editId = s.id;
    this.editForm.reset();
    this.editForm.patchValue(s);
  }

  updateSupplier() {
    this.editForm.markAllAsTouched();

    if (this.editForm.invalid) return;

    this.service.update(this.editId, this.editForm.value)
      .subscribe(() => {

        this.loadSuppliers();
        this.closeModal('editModal');

        this.showUpdateSuccess = true;
        setTimeout(() => this.showUpdateSuccess = false, 3000);
      });
  }

  // ================= DELETE =================
  deleteSupplier: Supplier | null = null;
  showDeleteSuccess = false;
  deleteError = '';

  openDelete(s: Supplier) {
    this.deleteSupplier = s;
    this.deleteError = '';
  }

  confirmDelete() {
    if (!this.deleteSupplier) return;

    this.service.delete(this.deleteSupplier.id)
      .subscribe({
        next: () => {

          this.loadSuppliers();
          this.closeModal('deleteModal');

          this.deleteSupplier = null;

          this.showDeleteSuccess = true;
          setTimeout(() => this.showDeleteSuccess = false, 3000);
        },
        error: (err) => {
          this.deleteError = err.error || 'Delete failed';
        }
      });
  }

  // ================= MODAL =================
  closeModal(id: string) {
    const el = document.getElementById(id);
    const modal = bootstrap.Modal.getInstance(el);
    modal?.hide();
  }
}
