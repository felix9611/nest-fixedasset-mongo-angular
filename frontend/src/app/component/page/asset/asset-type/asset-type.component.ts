import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { getApiWithAuth, postApiWithAuth } from '../../../../../tool/httpRequest-auth'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzFormModule } from 'ng-zorro-antd/form'
import moment from 'moment'
import { AssetTypeForm } from './interface'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { NzInputNumberModule } from 'ng-zorro-antd/input-number'
import { UserStoreService } from '../../../../../state/user.service'
import { findMenuItem } from '../../../tool-function'

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
        NzInputNumberModule
    ],
    templateUrl: './asset-type.component.html',
    styleUrl: './asset-type.component.css',
})
export class AssetTypeComponent {
    constructor(
        private message: NzMessageService,
        private userStoreService: UserStoreService
    ) {

        this.userStoreService.menuRole$.subscribe((data: any) => {
            const answer = findMenuItem(data, 'Asset Type', 'asset-type')
                                            
            this.userRightInside = {
                read: answer.read,
                write: answer.write,
                update: answer.update,
                delete: answer.delete
            }
            console.log(this.userRightInside, 'answer')
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

    editForm: AssetTypeForm = {
        _id: '',
        typeCode: '',
        typeName: '',
        remark: '',
        depreciationRate: 0
    }

    okText: string = 'Create'

    dataLists: any[] = []
    totals: number = 0
    editFormDialog: boolean = false
    removeDialog: boolean = false
    handleRemoveId: string = ''

    ngOnInit() {
        this.loadAssetTypeLists()
    }

    async submitForm() {
        const url = this.editForm._id === '' ? '/asset/type/create' : `/asset/type/update`

        const res = await postApiWithAuth(url, {
            
            ...this.editForm,
            ...this.editForm._id ? { _id: this.editForm._id} : {},
            ...this.editForm.depreciationRate ? { depreciationRate: this.editForm.depreciationRate / 100 } : {}
        })

        if (res.msg) {
            this.message.error(res.msg)
        } else if (res.matchedCount === 1 || !res.msg) {
            this.message.success('Save successful!')
            this.closeDialog()
            this.loadAssetTypeLists()

            this.editForm = {
                _id: '',
                typeCode: '',
                typeName: '',
                remark: ''
            }
        }
    }

    async loadAssetTypeLists() {
        const res = await postApiWithAuth('/asset/type/list', this.searchForm)
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
        if (this.handleRemoveId) {
            const url = `/asset/type/remove/${this.handleRemoveId}`

            const res: any = await getApiWithAuth(url)

            this.message.info(res.msg)

            this.closeRemoveDialog()
            this.loadAssetTypeLists()
        }
    }


    dateFormat(data: string) {
        return data ? moment(new Date(data)).format('DD-MM-YYYY HH:MM') : null
    }

    async getOneData(id:string) {
        const res = await getApiWithAuth(`/asset/type/one/${id}`)
        this.editForm = {
            ...res,
            depreciationRate: res.depreciationRate * 100
        }
        this.okText = 'Update'
        this.showDialog()
    }

}