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
import { CodeTypeForm } from './interface'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'

@Component({
    // selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, NzFormModule, NzButtonModule, FormsModule, NzModalModule, NzTableModule, NzInputModule, NzPaginationModule],
    templateUrl: './code-type.component.html',
    styleUrl: './code-type.component.css',
})
export class CodeTypeComponent {
    constructor(
        private message: NzMessageService,
        private modalService: NzModalService
    ) {}

    searchForm: any = {
        page: 1,
        limit: 10
    }

    editForm: CodeTypeForm = {
        _id: '',
        valueCode: '',
        valueName: '',
        type: ''
    }

    okText: string = 'Create'

    dataLists: any[] = []
    totals: number = 0
    editFormDialog: boolean = false
    removeDialog: boolean = false
    handleRemoveId: string = ''

    ngOnInit() {
        this.loadCodeTypeLists()
    }

    async submitForm() {
        const url = this.editForm._id === '' ? '/base/code-type/create' : `/base/code-type/update`

        const res = await postApiWithAuth(url, this.editForm)

        if (res.msg) {
            this.message.error(res.msg)
        } else if (res.matchedCount === 1 || !res.msg) {
            this.message.success('Save successful!')
            this.closeDialog()
            this.loadCodeTypeLists()

            this.editForm = {
                _id: '',
                valueCode: '',
                valueName: '',
                type: ''
            }
        }
    }

    async loadCodeTypeLists() {
        const res = await postApiWithAuth('/base/code-type/list', this.searchForm)
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
        const url = `/base/code-type/remove/${this.handleRemoveId}`

        const res: any = getApiWithAuth(url)

        this.message.info(res.msg)

        this.closeRemoveDialog()
        this.loadCodeTypeLists()
    }


    dateFormat(data: string) {
        return data ? moment(new Date(data)).format('DD-MM-YYYY HH:MM') : null
    }

    async getOneData(id:string) {
        const res = await getApiWithAuth(`/base/code-type/one/${id}`)
        this.editForm = res
        this.okText = 'Update'
        this.showDialog()
    }

}