import { Component, HostListener, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router'

import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { CartsStoreService } from '../../state/CartsStoreService'
import { UserStoreService } from '../../../state/user.service'
import { UserInfo } from '../../../state/interface'

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
    constructor(private userService: UserStoreService) {}

    isMenuExpanded: boolean = window.innerWidth > 700 // Expand only on large screens
    screenWidth: number = window.innerWidth
    
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.screenWidth = window.innerWidth;
        this.isMenuExpanded = this.screenWidth > 700
    }

    userInfo: UserInfo = { 
        username: '',
        accessToken: '',
        avatarBase64: '',
        deptId: 0,
        roleIds: [] 
    }

    ngOnInit() {
        const data = this.userService.user$.subscribe(user => {
            this.userInfo = user
        })
    }

    logout() {
        this.userService.logout()
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