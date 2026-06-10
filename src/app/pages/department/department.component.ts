import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Department, DepartmentService } from '../../services/department/department.service';

declare var bootstrap: any;

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent implements OnInit {

  private service = inject(DepartmentService);
  private fb = inject(FormBuilder);

  departments: Department[] = [];

  loading = false;
  errorMessage = '';

  search = '';

  pageNumber = 1;
  pageSize = 3;
  totalCount = 0;

  selectedId = 0;

  deleteDepartment?: Department;

  showAddSuccess = false;
  showUpdateSuccess = false;
  showDeleteSuccess = false;

  deleteErrorMessage = '';

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  get startItem(): number {
    if (this.totalCount === 0) return 0;
    return (this.pageNumber - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    const end = this.pageNumber * this.pageSize;
    return end > this.totalCount ? this.totalCount : end;
  }

  ngOnInit(): void {
    this.getDepartments();
  }

  // ================= GET =================

  getDepartments() {

    this.loading = true;
    this.errorMessage = '';

    this.service.getAll({
      search: this.search,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    })
      .subscribe({

        next: (res) => {

          this.departments = res.items;
          this.totalCount = res.totalCount;

          this.loading = false;

        },

        error: () => {

          this.loading = false;

          this.errorMessage =
            'Failed To Load Departments';

        }

      });

  }

  // ================= SEARCH =================

  onSearch() {

    this.pageNumber = 1;

    this.getDepartments();

  }

  // ================= PAGINATION =================

  changePage(page: number) {

    if (page < 1) return;

    this.pageNumber = page;

    this.getDepartments();

  }

  // ================= ADD =================

  addForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]]
  });

  addDepartment() {

    if (this.addForm.invalid) return;

    this.service.add(this.addForm.value)
      .subscribe(() => {

        this.getDepartments();

        this.closeModal('addModal');

        this.addForm.reset();

        this.showAddSuccess = true;

        setTimeout(() => {
          this.showAddSuccess = false;
        }, 4000);

      });

  }

  // ================= UPDATE =================

  editForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]]
  });

  openEdit(dep: Department) {

    this.selectedId = dep.id;

    this.editForm.patchValue({
      name: dep.name
    });

  }

  updateDepartment() {

    if (this.editForm.invalid) return;

    this.service.update(
      this.selectedId,
      this.editForm.value
    )
      .subscribe(() => {

        this.getDepartments();

        this.closeModal('editModal');

        this.showUpdateSuccess = true;

        setTimeout(() => {
          this.showUpdateSuccess = false;
        }, 4000);

      });

  }

  // ================= DELETE =================
  isDeleting = false;

  openDelete(dep: Department) {

    this.deleteDepartment = dep;

    this.deleteErrorMessage = '';

  }

  confirmDelete() {

    if (!this.deleteDepartment || this.isDeleting)
      return;

    this.isDeleting = true;

    this.service.delete(this.deleteDepartment.id)
      .subscribe({

        next: () => {

          this.closeModal('deleteModal');

          this.deleteDepartment = undefined;

          this.getDepartments();

          this.showDeleteSuccess = true;

          setTimeout(() => {
            this.showDeleteSuccess = false;
          }, 4000);

          this.isDeleting = false;
        },

        error: (err) => {

          this.isDeleting = false;

          this.deleteErrorMessage =
            typeof err.error === 'string'
              ? err.error
              : 'Delete Failed';
        }

      });
  }

  // ================= MODAL =================

  closeModal(id: string) {

    const modalElement =
      document.getElementById(id);

    const modal =
      bootstrap.Modal.getInstance(modalElement);

    modal?.hide();

  }

}
