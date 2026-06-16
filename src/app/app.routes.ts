import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProductsComponent } from './pages/products/products.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { StudentsComponent } from './pages/students/students.component';
import { DepartmentComponent } from './pages/department/department.component';
import { LandingComponent } from './landing/landing.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { LoginComponent } from './auht/login/login.component';
import { RegisterComponent } from './auht/register/register.component';
import { AuthGuard } from './services/guard/guard.service';
import { UsersComponent } from './pages/users/users.component';
import { RoleGuard } from './services/roleGurd/RoleGuard.service';


export const routes: Routes = [

  // Landing Page
  {
    path: '',
    component: LandingComponent
  },

  // Auth Pages

  {
    path: 'login' ,
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  // {
  //   path: '',
  //   component: DashboardLayoutComponent,
  //   canActivate: [AuthGuard],
  //   children: [

  //     { path: 'dashboard', component: HomeComponent },
  //     { path: 'products', component: ProductsComponent },
  //     { path: 'orders', component: OrdersComponent },
  //     { path: 'customers', component: CustomersComponent },
  //     { path: 'students', component: StudentsComponent },
  //     { path: 'department', component: DepartmentComponent },
  //      {path: 'users' , component:UsersComponent}

  //   ]
  // },

  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [

      { path: 'dashboard', component: HomeComponent, canActivate: [RoleGuard], data: { roles: ['Admin', 'User'] } },

      { path: 'products', component: ProductsComponent, canActivate: [RoleGuard], data: { roles: ['Admin', 'User'] } },

      { path: 'orders', component: OrdersComponent, canActivate: [RoleGuard], data: { roles: ['Admin', 'User'] } },

      { path: 'customers', component: CustomersComponent, canActivate: [RoleGuard], data: { roles: ['Admin'] } },

      { path: 'students', component: StudentsComponent, canActivate: [RoleGuard], data: { roles: ['Admin'] } },

      { path: 'department', component: DepartmentComponent, canActivate: [RoleGuard], data: { roles: ['Admin'] } },

      { path: 'users', component: UsersComponent, canActivate: [RoleGuard], data: { roles: ['Admin'] } }

    ]
  },

  {
    path: '**',
    component: NotFoundComponent
  }

];
