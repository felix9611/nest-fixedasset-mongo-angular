import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { deleteApiWithAuth, getApiWithAuth, postApiWithAuth } from '../../../../tool/httpRequest-auth'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzFormModule } from 'ng-zorro-antd/form'
import moment from 'moment'
import { RoleForm } from './interface'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'

@Component({
    // selector: 'app-footer',
    standalone: true,
    imports: [NzCheckboxModule, CommonModule, NzFormModule, NzButtonModule, FormsModule, NzModalModule, NzTableModule, NzInputModule, NzPaginationModule],
    templateUrl: './role.component.html',
    styleUrl: './role.component.css',
})
export class RoleComponent {
    constructor(
        private message: NzMessageService
    ) {}

    searchForm: any = {
        page: 1,
        limit: 10
    }

    editForm: RoleForm = {
        _id: '',
        code: '',
        name: '',
        remark: '',
        read: false,
        write: false,
        delete: false,
        update: false,
    }

    okText: string = 'Create'

    dataLists: any[] = []
    totals: number = 0
    editFormDialog: boolean = false
    removeDialog: boolean = false
    handleRemoveId: string = ''

    ngOnInit() {
        this.loadSysRoleLists()
    }

    async submitForm() {
        const url = this.editForm._id === '' ? '/sys/role/create' : `/sys/role/update`

        const res = await postApiWithAuth(url, {
            
            ...this.editForm,
            ...this.editForm._id ? { _id: this.editForm._id} : {},
        })

        if (res.msg) {
            this.message.error(res.msg)
        } else if (res.matchedCount === 1 || !res.msg) {
            this.editForm = {
                _id: '',
                code: '',
                name: '',
                remark: '',
                read: false,
                write: false,
                delete: false,
                update: false,
            }

            this.message.success('Save successful!')
            this.closeDialog()
            this.loadSysRoleLists()

            
        }
    }

    async loadSysRoleLists() {
        const res = await postApiWithAuth('/sys/role/list', this.searchForm)
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
        const url = `/sys/role/remove/${this.handleRemoveId}`

        const res: any = getApiWithAuth(url)

        if (res.msg) {
            this.message.info(res.msg)
        }
        this.loadSysRoleLists()
        this.closeRemoveDialog()
        
    }


    dateFormat(data: string) {
        return data ? moment(new Date(data)).format('DD-MM-YYYY HH:MM') : null
    }

    async getOneData(id:string) {
        const res = await getApiWithAuth(`/sys/role/one/${id}`)
        this.editForm = res
        this.okText = 'Update'
        this.showDialog()
    }

}