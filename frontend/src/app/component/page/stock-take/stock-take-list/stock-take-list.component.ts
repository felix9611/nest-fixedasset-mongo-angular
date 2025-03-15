import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { deleteApiWithAuth, getApiWithAuth, postApiWithAuth } from '../../../../../tool/httpRequest-auth'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzFormModule } from 'ng-zorro-antd/form'
import moment from 'moment'
// import { RoleForm } from './interface'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'

@Component({
    standalone: true,
    imports: [NzCheckboxModule, CommonModule, NzFormModule, NzButtonModule, FormsModule, NzModalModule, NzTableModule, NzInputModule, NzPaginationModule, FormsModule],
    templateUrl: './stock-take-list.component.html',
    styleUrl: './stock-take-list.component.css',
})
export class StockTakeListComponent implements OnInit{
    ngOnInit(): void {
        
    }

    dataLists: any[] = []
    totals: number = 0

    searchForm: any = {
        page: 1,
        limit: 10
    }
    formDialog: boolean = false

    showDialog() {
        this.formDialog = true
    }

    async loadStockTakeLists() {

    }
}