import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

interface Customer {
  id: number,
  name: string,
}
@Component({
  selector: 'app-customers',
  imports: [],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {

  ngOnInit(): void {
    this.getAllCustomers();
  }

  customers: Customer[] = [];
  defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  loading = false;
  errorMessage = '';

  http = inject(HttpClient);

  getAllCustomers() {
    this.loading = true;

    this.errorMessage = '';

    this.http.get<Customer[]>("https://localhost:7298/api/customers")
      // .subscribe(
      //   result => {
      //     this.customers = result;
      //   }
      // )
      .subscribe({

        next: (res) => {

          this.customers = res;

          this.loading = false;

        },

        error: (err) => {

          console.log(err);

          this.loading = false;

          this.errorMessage = 'Failed To Load customers';

        }

      })
  }


}
