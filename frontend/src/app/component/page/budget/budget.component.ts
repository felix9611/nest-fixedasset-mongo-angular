import { Component, OnChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { getApiWithAuth, postApiWithAuth } from '../../../../tool/httpRequest-auth'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzFormModule } from 'ng-zorro-antd/form'
import moment from 'moment'
import { BudgetForm } from './interface'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { NzInputNumberModule } from 'ng-zorro-antd/input-number'

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
        NzInputNumberModule
    ],
    templateUrl: './budget.component.html',
    styleUrl: './budget.component.css',
})
export class BudgetComponent {
    constructor(
        private message: NzMessageService,
        private modalService: NzModalService
    ) {}

    searchForm: any = {
        date: [],
        page: 1,
        limit: 10
    }

    editForm: BudgetForm =  {
        _id: '',
        deptId: '',
        placeId: '',
        budgetNo: '',
        budgetName: '',
        year: '',
        month: '',
        budgetAmount: 0,
        budgetFrom: '',
        budgetTo: '',
        budgetStatus: '',
        remark: '',
    }

    okText: string = 'Create'

    dataLists: any[] = []
    totals: number = 0
    editFormDialog: boolean = false
    removeDialog: boolean = false
    handleRemoveId: string = ''
    taxInformation: boolean = false

    fileList: any[] = []
    deptLists: any[] = []
    placeLists: any[] = []

    department?: any = {}


    ngOnInit() {
        this.loadBudgetLists()
        this.loadDeptLists()
        this.loadPlaceLists()
        this.tests()
    }

    async loadPlaceLists() {
        this.placeLists = await getApiWithAuth('/base/location/getAll')
    }

    async loadDeptLists() {
        this.deptLists = await getApiWithAuth('/base/budget/getBudgetSummary')
    }

    async tests() {
        await getApiWithAuth('/sys/department/getAll')
    }

    async submitForm() {
        const url = this.editForm._id === '' ? '/base/budget/create' : `/base/budget/update`

        console.log(this.editForm)
        const res = await postApiWithAuth(url, this.editForm)

        if (res.msg) {
            this.message.error(res.msg)
        } else if (res.matchedCount === 1 || !res.msg) {
            this.message.success('Save successful!')
            this.closeDialog()
            this.loadBudgetLists()

            this.editForm = {
                _id: '',
                deptId: '',
                placeId: '',
                budgetNo: '',
                budgetName: '',
                year: '',
                month: '',
                budgetAmount: 0,
                budgetFrom: '',
                budgetTo: '',
                budgetStatus: '',
                remark: '',
            }
        }
    }

    async loadBudgetLists() {
        const res = await postApiWithAuth('/base/budget/list', this.searchForm)
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

    async handleRemove() {
        const url = `/base/budget/remove/${this.handleRemoveId}`

        const res: any = await getApiWithAuth(url)

        this.message.info(res.msg)
        this.loadBudgetLists()
        this.closeRemoveDialog()
        
    }


    dateFormat(data: string) {
        return data ? moment(new Date(data)).format('DD-MM-YYYY HH:MM') : null
    }

    async getOneData(id:string) {
        const res = await getApiWithAuth(`/base/budget/one/${id}`)
        this.editForm = res
        this.department = res.department
        this.okText = 'Update'
        this.showDialog()
    }
}