import { Component, OnInit } from '@angular/core'
import { deleteApiWithAuth, getApiWithAuth, postApiWithAuth } from '../../../../tool/httpRequest-auth'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'
import { CommonModule } from '@angular/common'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzFormModule } from 'ng-zorro-antd/form'
import { FormsModule } from '@angular/forms'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzInputModule } from 'ng-zorro-antd/input'
import { MenuForm } from './interface'

@Component({
    standalone: true,
    imports: [NzCheckboxModule, CommonModule, NzFormModule, NzButtonModule, FormsModule, NzModalModule, NzTableModule, NzInputModule],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css',
})
export class MenuListComponent implements OnInit {
    ngOnInit(): void {
        this.loadSysMenuLists()
    }

    searchForm = {
        name: ''
    }

    editForm: MenuForm = {
        _id: '',
        mainId: '',
        name: '',
        icon: '',
        path: '',
        sort: 0,
        type: 0
    }
    

    dataLists: any[] = []
    async loadSysMenuLists() {
        const res = await postApiWithAuth('/sys/menu/list', this.searchForm)
        this.dataLists = res
    }
}