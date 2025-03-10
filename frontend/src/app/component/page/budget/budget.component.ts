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
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload'
import { imgToBase64, uploadImgToBase64 } from '../../../../tool/imageUpload'
import { Observable, Observer } from 'rxjs'
import { NzSelectModule } from 'ng-zorro-antd/select'

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
        NzUploadModule,
        NzSelectModule
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
        page: 1,
        limit: 10
    }

    editForm: any =  {
        _id: '',
        deptId: '',
        department: {},
        placeId: '',
        place: {},
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

    fileList: any[] = []
    deptLists: any[] = []
    placeLists: any[] = []

    department?: any = {}


    ngOnInit() {
        this.loadUserLists()
        this.loadDeptLists()
        this.loadPlaceLists()
    }

    async loadPlaceLists() {
        this.placeLists = await getApiWithAuth('/base/location/getAll')
    }

    async loadDeptLists() {
        this.deptLists = await getApiWithAuth('/sys/department/getAll')
    }

    async submitForm() {
        const url = this.editForm._id === '' ? '/base/budget/create' : `/base/budget/update`

        console.log(this.editForm.department)
        const res = await postApiWithAuth(url, this.editForm._id? {
            avatarBase64: this.editForm.avatarBase64,
            deptId: this.editForm.department?._id,
            ...this.editForm
        } : {
            key: '9@0UtWV:;}m@HkjHyVU=',
            userData: {
                deptId: this.editForm.department?._id,
                ...this.editForm
            }
        })

        if (res.msg) {
            this.message.error(res.msg)
        } else if (res.matchedCount === 1 || !res.msg) {
            this.message.success('Save successful!')
            this.closeDialog()
            this.loadUserLists()

            this.editForm = {
                _id: '',
                deptId: '',
                department: {},
                placeId: '',
                place: {},
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

    async loadUserLists() {
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
        this.loadUserLists()
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

    departmentOnChanges(newValue: any) {
        this.editForm.department = this.deptLists.find((item: any) => item._id === newValue)
        console.log(this.editForm.department)
    }

}