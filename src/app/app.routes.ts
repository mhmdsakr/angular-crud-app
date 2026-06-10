import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProductsComponent } from './pages/products/products.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { StudentsComponent } from './pages/students/students.component';
import { DepartmentComponent } from './pages/department/department.component';


export const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'department', component: DepartmentComponent },



  { path: '**', component: NotFoundComponent }
];
