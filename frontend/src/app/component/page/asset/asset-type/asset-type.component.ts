import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { postApiWithAuth } from '../../../../../tool/httpRequest-auth'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzFormModule } from 'ng-zorro-antd/form'
import moment from 'moment'
import { AssetTypeForm } from './interface'



@Component({
    // selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, NzFormModule, RouterOutlet, RouterLink, RouterLinkActive, NzButtonModule, FormsModule, NzModalModule, NzTableModule, NzInputModule],
    templateUrl: './asset-type.component.html',
    styleUrl: './asset-type.component.css',
})
export class AssetTypeComponent {
    constructor() {}

    searchForm: any = {
        page: 1,
        limit: 20
    }

    editForm: AssetTypeForm = {
        _id: '',
        typeCode: '',
        typeName: '',
        remark: ''
    }

    dataLists: any[] = []
    totals: number = 0
    editFormDialog: boolean = false

    ngOnInit() {
        this.loadAssetTypeLists()
    }

    async submitForm() {

    }

    async loadAssetTypeLists() {
        const res = await postApiWithAuth('/asset/type/list', this.searchForm)
        this.dataLists = res.lists
        this.totals = res.totals
    }

    async editDialg(row: any) {

    }

    showDialog() {
        this.editFormDialog = true
    }

    closeDialog() {
        this.editFormDialog = false
    }


    dateFormat(data: string) {
        return data ? moment(new Date(data)).format('DD-MM-YYYY HH:MM') : null
    }
}