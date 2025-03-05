import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { CartStateFace, Promotion, CartFace } from './interfaceType'

@Injectable({
  providedIn: 'root'
})
export class CartsStoreService {
    private initialState: CartStateFace = { list: [] }
    private cartSubject = new BehaviorSubject< CartStateFace>(this.initialState)
    carts$ = this.cartSubject.asObservable()

    get carts(): CartFace[] {
        return this.cartSubject.value.list
    }
    
    setPromotions(carts: CartFace[]): void {
        this.cartSubject.next({ list: carts })
    }
      
    addPromotion(promotion: CartFace): void {
        const updatedList = [...this.carts, promotion]
        this.cartSubject.next({ list: updatedList })
    }

    updatePromotion(productId: number, cartSubject: Partial<CartFace>): void {
        const updatedList = this.carts.map(promo =>
          promo.productId === productId ? { ...promo, ...cartSubject } : promo
        )
        this.cartSubject.next({ list: updatedList })
    }
    
    deletePromotion(productId: number): void {
        const updatedList = this.carts.filter(promo => promo.productId !== productId);
        this.cartSubject.next({ list: updatedList })
    }
}