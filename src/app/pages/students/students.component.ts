import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService, Student } from './../../services/student/student.service';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit {

  private service = inject(StudentService);
  private fb = inject(FormBuilder);

  students: Student[] = [];
  departments: any[] = [];

  loading = false;
  search = '';

  pageNumber = 1;
  pageSize = 9;
  totalCount = 0;

  selectedId = 0;
  deleteStudent?: Student;

  showAddSuccess = false;
  showUpdateSuccess = false;
  showDeleteSuccess = false;



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
    this.getStudents();
    this.loadDepartments();
  }

  // ================= GET =================
  getStudents() {
    this.loading = true;

    this.service.getAll({
      search: this.search,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    }).subscribe(res => {
      this.students = res.items;
      this.totalCount = res.totalCount;
      this.loading = false;
    });
  }

  loadDepartments() {
    this.service.getDepartments().subscribe(res => {
      this.departments = res.items ?? res;
    });
  }

  // ================= SEARCH =================
  onSearch() {
    this.pageNumber = 1;
    this.getStudents();
  }

  changePage(page: number) {
    if (page < 1) return;
    this.pageNumber = page;
    this.getStudents();
  }

  // ================= FORMS =================
  addForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    nativeName: ['', [Validators.required, Validators.minLength(3)]],
    departmentId: [null, Validators.required]
  });

  editForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    nativeName: ['', [Validators.required, Validators.minLength(3)]],
    departmentId: this.fb.control<number | null>(null, Validators.required),

  });


  markTouched(form: any) {
    Object.values(form.controls).forEach((c: any) => c.markAsTouched());
  }

  // ================= ADD =================
  addStudent() {
    if (this.addForm.invalid) {
      this.markTouched(this.addForm);
      return;
    }

    this.service.add(this.addForm.value).subscribe(() => {
      this.getStudents();
      this.closeModal('addModal');

      this.addForm.reset({ departmentId: null });

      this.showAddSuccess = true;
      setTimeout(() => this.showAddSuccess = false, 3000);
    });
  }

  // ================= EDIT =================

  openEdit(s: Student) {
    this.selectedId = s.id;

    this.editForm.patchValue({
      name: s.name ?? '',
      nativeName: s.nativeName ?? '',
      departmentId: s.departmentId ?? null
    });
  }

  updateStudent() {
    if (this.editForm.invalid) return;

    this.service.update(this.selectedId, this.editForm.value)
      .subscribe(() => {
        this.getStudents();
        this.closeModal('editModal');

        this.showUpdateSuccess = true;
        setTimeout(() => this.showUpdateSuccess = false, 3000);
      });
  }

  // ================= DELETE =================
  openDelete(s: Student) {
    this.deleteStudent = s;
  }

  confirmDelete() {
    if (!this.deleteStudent) return;

    this.service.delete(this.deleteStudent.id).subscribe(() => {
      this.getStudents();
      this.closeModal('deleteModal');

      this.showDeleteSuccess = true;
      setTimeout(() => this.showDeleteSuccess = false, 3000);
    });
  }

  // ================= MODAL =================
  closeModal(id: string) {
    const modal = document.getElementById(id);
    const instance = bootstrap.Modal.getInstance(modal);
    instance?.hide();
  }
}
