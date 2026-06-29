import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/CartService/cart-service.service';
import { AuthService } from '../../services/auth/auth.service';
import { Product, ProductService, PagedResult } from '../../services/product/product.service';

declare var bootstrap: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  // ================= DATA =================
  products: Product[] = [];
  searchText = '';

  loading = false;
  errorMessage = '';

  pageNumber = 1;
  pageSize = 6;
  totalCount = 0;

  apiUrl = 'https://localhost:7298';
  defaultImage = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c';

  categories: any[] = [];
  suppliers: any[] = [];

  // ================= INIT =================
  ngOnInit(): void {
    this.loadProducts();
    this.loadLookups();
  }

  // ================= LOAD =================
  loadLookups() {
    this.productService.getCategories().subscribe(res => {
      this.categories = res.items;
    });

    this.productService.getSuppliers().subscribe(res => {
      this.suppliers = res.items;
    });
  }

  loadProducts() {
    this.loading = true;
    this.errorMessage = '';

    this.productService
      .getAll(this.pageNumber, this.pageSize, this.searchText)
      .subscribe({
        next: (res: PagedResult<Product>) => {
          this.products = res.items;
          this.totalCount = res.totalCount;

          // backend authoritative
          this.pageNumber = res.pageNumber;
          this.pageSize = res.pageSize;

          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Failed To Load Products';
        }
      });
  }

  // ================= SEARCH =================
  private searchTimeout: any;

  onSearchChange() {
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.pageNumber = 1;
      this.loadProducts();
    }, 400);
  }
  // ================= PAGINATION =================
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.pageNumber = page;
    this.loadProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  // ================= ADD =================
  showSuccess = false;
  selectedImageUrl = '';

  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    categoryId: [0, Validators.required],
    supplierId: [0, Validators.required],
    price: [1, [Validators.required, Validators.min(1)]],
    stock: [1, [Validators.required, Validators.min(1)]],
    isAvailable: [true]
  });

  addProduct() {
    if (this.productForm.invalid) return;

    const model = {
      ...this.productForm.value,
      mainImage: this.selectedImageUrl
    };

    // console.log(model);

    this.productService.add(model)
      .subscribe(() => {
        this.loadProducts();
        this.productForm.reset();

        this.showSuccess = true;
        this.closeModal('addModal');

        setTimeout(() => this.showSuccess = false, 5000);
      });

    // console.log('selectedImageUrl=', this.selectedImageUrl);
  }

  onImageSelected(event: any) {

    const file = event.target.files[0];

    if (!file) return;

    this.productService.uploadImage(file)
      .subscribe({
        next: (url) => {
          // console.log(url);
          this.selectedImageUrl = url;
        }
      });
  }

  // ================= UPDATE =================
  editProductId = 0;
  showUpdateSuccess = false;
  editImageUrl = '';

  editForm = this.fb.group({
    name: ['', Validators.required],
    categoryId: [0, Validators.required],
    supplierId: [0, Validators.required],
    price: [1, Validators.required],
    stock: [1, Validators.required],
    isAvailable: [true]
  });

  openEdit(p: Product) {
    this.editProductId = p.id;
    this.editImageUrl = p.mainImage || '';

    this.editForm.patchValue({
      name: p.name,
      categoryId: p.categoryId,
      supplierId: p.supplierId,
      price: p.price,
      stock: p.stock,
      isAvailable: p.isAvailable
    });
  }

  updateProduct() {
    if (this.editForm.invalid) return;

    // this.productService.update(this.editProductId, this.editForm.value)
    const model = {
      ...this.editForm.value,
      mainImage: this.editImageUrl
    };

    this.productService.update(
      this.editProductId,
      model
    )
      .subscribe(() => {
        this.loadProducts();
        this.showUpdateSuccess = true;
        this.closeModal('editModal');
        setTimeout(() => this.showUpdateSuccess = false, 5000);
      });
  }



  onEditImageSelected(event: any) {

    const file = event.target.files[0];

    if (!file) return;

    this.productService.uploadImage(file)
      .subscribe(url => {

        this.editImageUrl = url;

      });
  }

  // ================= DELETE =================
  deleteProduct: Product | null = null;
  deleteErrorMessage = '';
  showDeleteSuccess = false;

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
          setTimeout(() => {
            this.showDeleteSuccess = false;
          }, 5000);
        },

        error: (err) => {
          this.deleteErrorMessage = err.error || 'Delete failed';
        }
      });
  }

  // ================= MODAL =================
  closeModal(id: string) {
    const modalElement = document.getElementById(id);
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  }

  // ================= CART =================
  addToCart(product: Product) {

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const item = cart.find((x: any) => x.productId === product.id);

    if (item) item.quantity++;
    else {
      cart.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        stock: product.stock,
        quantity: 1,
        mainImage: product.mainImage
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartService.refreshCartCount();
  }

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

}
