import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router'

import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { CartsStoreService } from '../../state/CartsStoreService'

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{
    constructor(private cartService: CartsStoreService) {}

    cartsTotal: number = 0

    ngOnInit() {
        this.cartService.carts$.subscribe(
            data => this.cartsTotal = data.list.length
        )
    }

    menuLists = [
        {
            path: '',
            name: 'Home',
            icon: false,
        },
        {
            path: 'product-list',
            name: 'Products',
            icon: false,
        },
        {
            path: 'store',
            name: 'Store',
            icon: false,
        },
        {
            name: 'shopping_cart',
            icon: true,

        }
    ]
}