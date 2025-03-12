import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { getApiWithAuth, postApiWithAuth } from '../../../../../tool/httpRequest-auth'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzFormModule } from 'ng-zorro-antd/form'
import moment from 'moment'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { AssetFormDto } from './interface'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'
import { NzInputNumberModule } from 'ng-zorro-antd/input-number'
import { ActivatedRoute, Router } from '@angular/router'
import { timer } from 'rxjs'

@Component({
    // selector: 'app-footer',
    standalone: true,
    imports: [
        CommonModule, 
        NzFormModule,
        NzButtonModule, 
        FormsModule, 
        NzModalModule, 
        NzTableModule, 
        NzInputModule, 
        NzPaginationModule,
        NzSelectModule,
        NzDatePickerModule,
        NzCheckboxModule,
        NzInputNumberModule
    ],
    templateUrl: './write-off-form.component.html',
    styleUrl: './write-off-form.component.css',
})
export class WriteOffFormComponent implements OnInit {

    constructor(
        private route: ActivatedRoute, 
        private routeTo: Router,
        private message: NzMessageService
    ) {}

    editForm: AssetFormDto = {
        _id: '',
        assetCode: '',
        assetName: '',
        unit: '',
        typeId: '',
        deptId: '',
        placeId: '',
        purchaseDate: '',
        description: '',
        sponsor:  false,
        sponsorName: '',
        cost: 0,
        serialNo:  '',
        invoiceNo: '',
        invoiceDate: '',
        invoiceRemark:  '',
        vendorId:  '',
        remark:  '',
        taxInfofId:  '',
        taxCountryCode:  '',
        taxCode:  '',
        taxRate:  0,
        includeTax: false,
        afterBeforeTax: 0,
        accountCode:  '',
        accountName: '',
        brandCode: '',
        brandName: '',
        chequeNo: '',
        maintenancePeriodStart: '',
        maintenancePeriodEnd: '',
        voucherNo: '',
        voucherUsedDate: '',
        assetListFiles: []
    }

    taxInformation: boolean = false

    theId: any = ''


    ngOnInit() {
        if (this.route.snapshot.paramMap.get('id')) {
            this.theId = this.route.snapshot.paramMap.get('id')
            this.getOne()
        }

        this.loadTypeList()
        this.loadDeptList()
        this.loadLocationList()
        this.loadVendorList()
    }

    async getOne() {
        this.editForm = await getApiWithAuth(`/asset/asset-list/one/${ this.theId}`)
    }

    typeLists: any[] = []
    async loadTypeList() {
        this.typeLists = await getApiWithAuth('/asset/type/getAll')
    }

    deptLists: any[] = []
    async loadDeptList() {
        this.deptLists = await getApiWithAuth('/sys/department/getAll')
    }

    placeLists: any[] = []
    async loadLocationList() {
        this.placeLists = await getApiWithAuth('/base/location/getAll')
    }

    vendorLists: any[] = []
    async loadVendorList() {
        this.vendorLists = await getApiWithAuth('/base/vendor/getAll')
    }
    

    async submitForm() {
        const url = this.editForm._id ? '/asset/asset-list/update' : '/asset/asset-list/create'

        const res = await postApiWithAuth(url, this.editForm)

        if (!res.msg) {
            this.message.info('Data save successfully!')
            timer(2500).subscribe(() => {
                this.routeTo.navigate(['/asset-list'])
            })
        }
    }

    backTo() {
        this.routeTo.navigate(['/asset-list'])
    }

    removeDialog: boolean = false


    goToWriteOff() {
        const finalForm = {

        }
    }

    closeRemoveDialog() {
        this.removeDialog = false
    }

    showDialog() {
        this.removeDialog = true
    }

}