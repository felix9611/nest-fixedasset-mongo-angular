import { Component, OnInit } from '@angular/core'
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
import { NzSelectModule } from 'ng-zorro-antd/select'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { StockTakeFormEdit } from './interface'
import { getApiWithAuth } from '../../../../../tool/httpRequest-auth'

@Component({
    standalone: true,
    imports: [
        NzSelectModule, 
        NzCheckboxModule, 
        CommonModule, 
        NzFormModule, 
        NzButtonModule, 
        FormsModule, 
        NzModalModule, 
        NzTableModule, 
        NzInputModule, 
        NzPaginationModule, 
        FormsModule
    ],
    templateUrl: './stock-take-form.component.html',
    styleUrl: './stock-take-form.component.css',
})
export class StockTakeFormComponent implements OnInit {
    constructor(
        private route: ActivatedRoute, 
        private routeTo: Router,
        private message: NzMessageService
    ) {}

    theId: any = ''

    editForm: StockTakeFormEdit = {
        actionName: '',
        actionPlaceId: '',
        remark: '',
        stockTakeItems: [],
        createdTime: '',
        finishTime: '',
        createBy: '',
        _id: ''
    }

    ngOnInit() {
        this.route.queryParams.subscribe((x: any) => {
            if (x.id) {
                this.theId = x.id
                this.getOne()
            }
        })
    }

    async getOne() {
        this.editForm = await getApiWithAuth(`/asset/stock-take/one/${ this.theId}`)    
    }
}