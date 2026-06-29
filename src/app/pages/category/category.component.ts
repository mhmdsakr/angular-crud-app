import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategoryService, Category } from '../../services/category/category.service';

declare var bootstrap: any;

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);

  categories: Category[] = [];
  searchText = '';

  pageNumber = 1;
  pageSize = 6;
  totalCount = 0;

  loading = false;

  // modals
  editId = 0;
  deleteItem: Category | null = null;

  closeModal(id: string) {

    const modalElement = document.getElementById(id);

    const modal = bootstrap.Modal.getInstance(modalElement);

    modal?.hide();
  }

  // forms
  addForm = this.fb.group({
    name: ['', Validators.required]
  });

  editForm = this.fb.group({
    name: ['', Validators.required]
  });

  ngOnInit(): void {
    this.load();
  }

  // ================= LOAD =================
  load() {
    this.loading = true;

    this.categoryService.getAll(this.pageNumber, this.pageSize, this.searchText)
      .subscribe(res => {
        this.categories = res.items;
        this.totalCount = res.totalCount;
        this.loading = false;
      });
  }

  // ================= SEARCH =================
  onSearch() {
    this.pageNumber = 1;
    this.load();
  }

  // ================= PAGINATION =================
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
    this.load();
  }

  get totalPages() {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  // ================= ADD =================
  showSuccess = false;

  add() {
    if (this.addForm.invalid) return;

    this.categoryService.add(this.addForm.value)
      .subscribe(() => {
        this.addForm.reset();
        this.showSuccess = true;
        this.closeModal('addModal');
        this.load();
        setTimeout(() => this.showSuccess = false, 5000);
      });
  }

  // ================= EDIT =================
  showUpdateSuccess = false;

  openEdit(c: Category) {
    this.editId = c.id;
    this.editForm.patchValue({
      name: c.name
    });
  }

  update() {
    if (this.editForm.invalid) return;

    this.categoryService.update(this.editId, this.editForm.value)
      .subscribe(() => {
        this.closeModal('editModal');
        this.showUpdateSuccess = true;
        this.load();
        setTimeout(() => this.showUpdateSuccess = false, 5000);
      });
  }

  // ================= DELETE =================
  showDeleteSuccess = false;

  openDelete(c: Category) {
    this.deleteItem = c;
  }

  confirmDelete() {
    if (!this.deleteItem) return;

    this.categoryService.delete(this.deleteItem.id)
      .subscribe(() => {
        this.closeModal('deleteModal');
        this.showDeleteSuccess = true;
        this.deleteItem = null;
        this.load();
        setTimeout(() => {
          this.showDeleteSuccess = false;
        }, 5000);
      });
  }
}
