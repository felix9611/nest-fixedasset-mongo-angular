import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Promotion, PromotionStateFace } from './interfaceType'
import { getApi } from '../tool/http/httpRequest';

@Injectable({
  providedIn: 'root'
})
export class PromotionStoreService {
  private initialState: PromotionStateFace = { list: [] }
  
  private promotionsSubject = new BehaviorSubject<PromotionStateFace>(this.initialState);
  promotions$ = this.promotionsSubject.asObservable()

  get promotions(): Promotion[] {
    return this.promotionsSubject.value.list
  }

  setPromotions(promotions: Promotion[]): void {
    this.promotionsSubject.next({ list: promotions })
  }
  
  addPromotion(promotion: Promotion): void {
    const updatedList = [...this.promotions, promotion]
    this.promotionsSubject.next({ list: updatedList })
  }

  deletePromotion(id: number): void {
    const updatedList = this.promotions.filter(promo => promo.id !== id);
    this.promotionsSubject.next({ list: updatedList })
  }

  async loadPromotionData(): Promise<any> {
    const res = await getApi('/base/promotion/store/list')
    this.setPromotions(res.data)
  }
}