import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartCountSubject = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCountSubject.asObservable();

  constructor() {
    this.refreshCartCount();
  }

  refreshCartCount() {

    const cart = JSON.parse(
      localStorage.getItem('cart') || '[]'
    );

    this.cartCountSubject.next(cart.length);
  }

}
