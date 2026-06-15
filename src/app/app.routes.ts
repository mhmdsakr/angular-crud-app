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


  // Dashboard Layout
  // {
  //   path: '',
  //   component: DashboardLayoutComponent,

  //   children: [

  //     {
  //       path: 'dashboard',
  //       component: HomeComponent
  //     },

  //     {
  //       path: 'products',
  //       component: ProductsComponent
  //     },

  //     {
  //       path: 'orders',
  //       component: OrdersComponent
  //     },

  //     {
  //       path: 'customers',
  //       component: CustomersComponent
  //     },

  //     {
  //       path: 'students',
  //       component: StudentsComponent
  //     },

  //     {
  //       path: 'department',
  //       component: DepartmentComponent
  //     }

  //   ]
  // },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [

      { path: 'dashboard', component: HomeComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'students', component: StudentsComponent },
      { path: 'department', component: DepartmentComponent }

    ]
  },

  {
    path: '**',
    component: NotFoundComponent
  }

];
