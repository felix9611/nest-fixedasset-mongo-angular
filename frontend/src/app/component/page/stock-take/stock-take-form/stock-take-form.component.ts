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
import { StockTakeFormEdit, StockTakeItemFromDto } from './interface'
import { getApiWithAuth, postApiWithAuth } from '../../../../../tool/httpRequest-auth'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'

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
        FormsModule,
        NzDatePickerModule,
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

    itemForm: StockTakeItemFromDto = {
        stockTakeId: '',
        assetId: '',
        assetCode: '',
        assetName: '',
        placeId: '',
        status: '',
        remark: ''
    }

    ngOnInit() {
        this.loadLocationList()
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

    placeLists: any[] = []
    async loadLocationList() {
        this.placeLists = await getApiWithAuth('/base/location/getAll')
    }

    async updateForm() {
        const res = await postApiWithAuth('/asset/stock-take/update-form', this.editForm)
        if (res.finished) {
            this.message.success(res.msg)
        } else {
            this.message.error(res.msg)
        }
    }

    async assetCodeChanged(event: any) {
        if (event) {
            const data = await getApiWithAuth(`/asset/asset-list/code/${event}`)
            this.itemForm.assetId = data._id
            this.itemForm.assetCode = data.assetCode
            this.itemForm.assetName = data.assetName
            this.itemForm.placeId = data.placeId
            this.placeCheckStatus(data.placeId)
        }
    }


    placeCheckStatus(placeIdRecord: string) {
        if (placeIdRecord === this.editForm.actionPlaceId) {
            this.itemForm.status = 'Exist'
        } else {
            this.itemForm.status = 'Wrong Location'
        }

    }

    async submitItem() {
        const finalData = {
            stockTakeId: this.editForm._id,
            assetId: this.itemForm.assetId,
            assetCode: this.itemForm.assetCode,
            placeId: this.itemForm.placeId,
            status: this.itemForm.status,
            remark: this.itemForm.remark
        }

        const res = await postApiWithAuth('/asset/stock-take/item-submit', finalData)

        if (res._id) {
            this.message.success('Added!')
            this.getOne()
        } else {
            this.message.error('Ooops! something wrong! Please try again!')
        }
    }

    dateFormat(data: string) {
        return data ? moment(new Date(data)).format('DD-MM-YYYY HH:MM') : null
    }
}