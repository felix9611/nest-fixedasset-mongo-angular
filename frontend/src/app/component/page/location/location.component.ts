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
import { LocationForm } from './interface'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { UserStoreService } from '../../../../state/user.service'
import { findMenuItem } from '../../tool-function'

@Component({
    // selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, NzFormModule, NzButtonModule, FormsModule, NzModalModule, NzTableModule, NzInputModule, NzPaginationModule],
    templateUrl: './location.component.html',
    styleUrl: './location.component.css',
})
export class LocationComponent {
    constructor(
        private message: NzMessageService,
        private userStoreService: UserStoreService
    ) {
        this.userStoreService.menuRole$.subscribe((data: any) => {
            const answer = findMenuItem(data, 'Location', 'location')
                                    
            this.userRightInside = {
                read: answer.read,
                write: answer.write,
                update: answer.update,
                delete: answer.delete
            }
        })
    }

    userRightInside: any = {
        read: false,
        write: false,
        update: false,
        delete: false
    }

    searchForm: any = {
        page: 1,
        limit: 10
    }

    editForm: LocationForm = {
        _id: '',
        placeCode: '',
        placeName: '',
        remark: ''
    }

    okText: string = 'Create'

    dataLists: any[] = []
    totals: number = 0
    editFormDialog: boolean = false
    removeDialog: boolean = false
    handleRemoveId: string = ''

    ngOnInit() {
        this.loadLocationLists()
    }

    async submitForm() {
        const url = this.editForm._id === '' ? '/base/location/create' : `/base/location/update`

        const res = await postApiWithAuth(url, {
            
            ...this.editForm,
            ...this.editForm._id ? { _id: this.editForm._id} : {},
        })

        if (res.msg) {
            this.message.error(res.msg)
        } else if (res.matchedCount === 1 || !res.msg) {
            this.message.success('Save successful!')
            this.closeDialog()
            this.loadLocationLists()

            this.editForm = {
                _id: '',
                placeCode: '',
                placeName: '',
                remark: ''
            }
        }
    }

    async loadLocationLists() {
        const res = await postApiWithAuth('/base/location/list', this.searchForm)
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
        const url = `/base/location/remove/${this.handleRemoveId}`

        const res: any = await getApiWithAuth(url)

        this.message.info(res.msg)

        this.closeRemoveDialog()
        this.loadLocationLists()
    }


    dateFormat(data: string) {
        return data ? moment(new Date(data)).format('DD-MM-YYYY HH:MM') : null
    }

    async getOneData(id:string) {
        const res = await getApiWithAuth(`/base/location/one/${id}`)
        this.editForm = res
        this.okText = 'Update'
        this.showDialog()
    }

}