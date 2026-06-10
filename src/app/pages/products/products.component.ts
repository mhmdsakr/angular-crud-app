import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  products: Product[] = [];

  filteredProducts: Product[] = [];
  searchText = '';

  loading = false;
  errorMessage = '';

  defaultImage = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c';


  pageNumber = 1;
  pageSize = 6;

  get paginatedProducts() {
    const start = (this.pageNumber - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredProducts.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  // ================= GET =================
  loadProducts() {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getAll().subscribe({
      next: (res) => {
        this.products = res;
        this.filteredProducts = res;

        this.pageNumber = 1; // مهم
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed To Load Products';
      }
    });
  }

  onSearchChange() {
    const value = this.searchText.toLowerCase().trim();

    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(value) ||
      p.category.toLowerCase().includes(value)
    );

    this.pageNumber = 1; // مهم جدًا
  }

  // ================= ADD =================
  showSuccess = false;

  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    category: ['', [Validators.required]],
    price: [1, [Validators.required, Validators.min(1)]],
    stock: [1, [Validators.required, Validators.min(1)]],
    isAvailable: [true]
  });

  addProduct() {
    if (this.productForm.invalid) return;

    this.productService.add(this.productForm.value)
      .subscribe(() => {

        this.loadProducts();
        this.productForm.reset();

        this.showSuccess = true;

        this.closeModal('addModal');

        setTimeout(() => this.showSuccess = false, 5000);
      });
  }

  // ================= UPDATE =================
  showUpdateSuccess = false;
  editProductId = 0;

  editForm = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: [1, Validators.required],
    stock: [1, Validators.required],
    isAvailable: [true]
  });

  openEdit(p: Product) {
    this.editProductId = p.id;
    this.editForm.patchValue(p);
  }

  updateProduct() {
    if (this.editForm.invalid) return;

    this.productService.update(this.editProductId, this.editForm.value)
      .subscribe(() => {

        this.loadProducts();
        this.closeModal('editModal');

        this.showUpdateSuccess = true;

        setTimeout(() => this.showUpdateSuccess = false, 5000);
      });
  }

  // ================= DELETE =================
  deleteProduct: Product | null = null;
  showDeleteSuccess = false;
  deleteErrorMessage = '';

  openDelete(p: Product) {
    this.deleteProduct = p;
    this.deleteErrorMessage = '';
  }

  confirmDelete() {
    if (!this.deleteProduct) return;

    this.productService.delete(this.deleteProduct.id)
      .subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal('deleteModal');

          this.deleteProduct = null;

          this.showDeleteSuccess = true;

          setTimeout(() => this.showDeleteSuccess = false, 5000);
        },
        error: (err) => {
          this.deleteErrorMessage = err.error;
        }
      });
  }

  // ================= helper =================
  closeModal(id: string) {
    const modalElement = document.getElementById(id);
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  }
}
