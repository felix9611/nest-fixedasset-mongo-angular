import { Component, HostListener, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterLink, RouterModule } from '@angular/router'

import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { TooltipModule } from 'primeng/tooltip'
import path from 'path'

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterLink, RouterModule, MatIconModule, MatButtonModule, TooltipModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{
    constructor(private router: Router) {
     //   let currentRoute = this.router.url.split('?')[0]

    }

    isMenuExpanded: boolean = window.innerWidth > 640 // Expand only on large screens
    screenWidth: number = window.innerWidth

    copyRights: any = {
        name: 'Felix',
        year: new Date().getFullYear()
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.screenWidth = window.innerWidth;
        this.isMenuExpanded = this.screenWidth > 640
    }


    ngOnInit() {
    }

    activeParent: any = null
    activeChild: any = null
    expandedMenus: any[] = []


    toggleMenu(item: any) {
        if (this.expandedMenus.includes(item)) {
          this.expandedMenus = this.expandedMenus.filter(menu => menu !== item) // Collapse menu
          if (this.activeParent === item) {
            this.activeParent = null
          }
        } else {
          this.expandedMenus.push(item) // Expand menu
          this.activeParent = item
        }
      }
    
    setActiveChild(child: any, parent: any) {
        this.activeParent = parent
        this.activeChild = child
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
                    path: 'users',
                    icon: 'account-circle'
                },
                {
                    label: 'Role',
                    path: 'role',
                    icon: ''
                },
                {
                    label: 'Menu',
                    icon: ''
                },
                {
                    label: 'Department',
                    path: 'department',
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
                    icon: '',
                    path: 'tax-information'
                },
                {
                    label: 'Budget',
                    path: 'budget',
                    icon: ''
                },
                {
                    label: 'Action Log',
                    icon: '',
                    path: 'action-record'
                },
                {
                    label: 'Vendor',
                    icon: '',
                    path: 'vendor'
                },
                {
                    label: 'Location',
                    path: 'location',
                    icon: 'location'
                },
                {
                    label: 'Code Type',
                    icon: '',
                    path: 'code-type'
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
                    icon: '',
                    path: 'asset-create'
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