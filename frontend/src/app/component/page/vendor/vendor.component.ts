import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { getApiWithAuth, postApiWithAuth } from '../../../../tool/httpRequest-auth'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzFormModule } from 'ng-zorro-antd/form'
import moment from 'moment'
import { VendorForm } from './interface'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'

@Component({
    // selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, NzFormModule, NzButtonModule, FormsModule, NzModalModule, NzTableModule, NzInputModule, NzPaginationModule],
    templateUrl: './vendor.component.html',
    styleUrl: './vendor.component.css',
})
export class VendorComponent {
    constructor(
        private message: NzMessageService,
        private modalService: NzModalService
    ) {}

    searchForm: any = {
        page: 1,
        limit: 10,
        name: '',
        place: '',
        contact: ''
    }

    editForm: VendorForm = {
        _id: '',
        vendorCode: '',
        vendorName: '',
        vendorOtherName: '',
        type: '',
        email: '',
        phone: '',
        fax: '',
        address: '',
        contactPerson: '',
        remark: '',
    }

    okText: string = 'Create'

    dataLists: any[] = []
    totals: number = 0
    editFormDialog: boolean = false
    removeDialog: boolean = false
    handleRemoveId: string = ''

    ngOnInit() {
        this.loadVendorLists()
    }

    async submitForm() {
        const url = this.editForm._id === '' ? '/base/vendor/create' : `/base/vendor/update`

        const res = await postApiWithAuth(url, this.editForm)

        if (res.msg) {
            this.message.error(res.msg)
        } else if (res.matchedCount === 1 || !res.msg) {
            this.message.success('Save successful!')
            this.closeDialog()
            this.loadVendorLists()

            this.editForm = {
                _id: '',
                vendorCode: '',
                vendorName: '',
                vendorOtherName: '',
                type: '',
                email: '',
                phone: '',
                fax: '',
                address: '',
                contactPerson: '',
                remark: '',
            }
        }
    }

    async loadVendorLists() {
        const res = await postApiWithAuth('/base/vendor/list', this.searchForm)
        this.dataLists = res.lists
        this.totals = res.total
    }

    showDialog() {
        this.editFormDialog = true
    }

    closeDialog() {
        this.editFormDialog = false
    }

    handleRomeve(id: string) {
        this.handleRemoveId = id
        this.removeDialog = true
    }

    closeRemoveDialog() {
        this.removeDialog = false
    }

    handleRemove() {
        const url = `/base/vendor/remove/${this.handleRemoveId}`

        const res: any = getApiWithAuth(url)

        this.message.info(res.msg)
        this.loadVendorLists()
        this.closeRemoveDialog()
        
    }


    dateFormat(data: string) {
        return data ? moment(new Date(data)).format('DD-MM-YYYY HH:MM') : null
    }

    async getOneData(id:string) {
        const res = await getApiWithAuth(`/base/vendor/one/${id}`)
        this.editForm = res
        this.okText = 'Update'
        this.showDialog()
    }

    cleanSearch() {
        this.searchForm = {}
        this.loadVendorLists()
    }

}