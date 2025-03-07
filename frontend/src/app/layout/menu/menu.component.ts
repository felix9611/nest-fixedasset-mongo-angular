import { Component, HostListener, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router'

import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { CartsStoreService } from '../../state/CartsStoreService'
import { TooltipModule } from 'primeng/tooltip'

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, RouterModule, MatIconModule, MatButtonModule, TooltipModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{
    constructor(private cartService: CartsStoreService) {}

    isMenuExpanded: boolean = window.innerWidth > 640; // Expand only on large screens
    screenWidth: number = window.innerWidth;

    copyRights: any = {
        name: 'Felix',
        year: new Date().getFullYear()
    }


    ngOnInit() {
    }

    @HostListener('window:resize', ['$event'])
     onResize(event: any) {
        this.screenWidth = window.innerWidth;
        this.isMenuExpanded = this.screenWidth > 640
    }


    toggleSubMenu(index: number) {
        this.menuItems[index].isOpen = !this.menuItems[index].isOpen;
    }

    menuItems: any[] = [
        {
            path: '',
            label: 'Home',
            icon: 'home'
        },
        {
            label: 'System Management',
            icon: 'settings',
            isOpen: false,
            childrens: [
                {
                    label: 'User',
                    icon: 'account-circle'
                },
                {
                    label: 'Role',
                    icon: ''
                },
                {
                    label: 'Menu',
                    icon: ''
                },
                {
                    label: 'Department',
                    icon: 'team_dashboard'
                }
            ]
        },
        {
            label: 'Base Management',
            icon: 'dock_to_bottom',
            isOpen: false,
            childrens: [
                {
                    label: 'Tax Information',
                    icon: ''
                },
                {
                    label: 'Action Log',
                    icon: ''
                },
                {
                    label: 'Vendor',
                    icon: ''
                }
            ]
        },
        {
            label: 'Asset Managemnt',
            icon: 'save',
            childrens: [
                {
                    label: 'Asset Type',
                    icon: '',
                    path: 'asset-type'
                },
                {
                    label: 'Asset List',
                    icon: ''
                },
                {
                    label: 'Create Asset',
                    icon: ''
                },
                {
                    label: 'Stock Take',
                    icon: ''
                },
                {
                    label: 'Asset List Report',
                    icon: ''
                },
                {
                    label: 'Stock Take Report',
                    icon: ''
                },
                {
                    label: 'Inventory Record',
                    icon: ''
                },
                {
                    label: 'Repair Record',
                    icon: ''
                }
            ]
        },
        {
            label: 'Dashboard',
            icon: 'dashboard'
        }
    ]
}