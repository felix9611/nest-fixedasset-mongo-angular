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
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { Router } from '@angular/router'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { UserStoreService } from '../../../../../state/user.service'
import { findMenuItem } from '../../../tool-function'
import { Subscription } from 'rxjs'
import { DownloadExcelDataComponent } from '../../../components/download-excel-component/download-excel-data-component.component'
import { FilterListApiSmall, ListOption } from '../../../components/filter-list-small/filter-list.component'

@Component({
    // selector: 'app-footer',
    standalone: true,
    imports: [ 
        NzSelectModule, 
        CommonModule, 
        NzFormModule, 
        NzButtonModule, 
        FormsModule, 
        NzModalModule, 
        NzTableModule, 
        NzInputModule, 
        NzPaginationModule,
        NzDatePickerModule,
        DownloadExcelDataComponent,
        FilterListApiSmall
    ],
    templateUrl: './write-off-list.component.html',
    styleUrl: './write-off-list.component.css',
})
export class WriteOffListComponent {
    private rightSubscription: Subscription
    private userRightSubscription: Subscription
    constructor(
        private message: NzMessageService,
        private userStoreService: UserStoreService,
        private routeTo: Router
     ) {
    
        this.rightSubscription = this.userStoreService.menuRole$.subscribe((data: any) => {
            const answer = findMenuItem(data, 'Write Off Record', 'write-off-list')
            this.userRightInside = {
                read: answer?.read ?? false,
                write: answer.write ?? false,
                update: answer.update ?? false,
                delete: answer.delete ?? false,
                upload: answer.upload ?? false
                // keep default value
            }
            this.excelFileSetting.code = answer?.excelFunctionCode ?? ''
            this.preLoadExcelSetting()
        })

        this.userRightSubscription = this.userStoreService.user$.subscribe((data: any) => {
            this.superAdmin = data.superAdmin
            if (!(data.superAdmin || data.admin)) {
                this.searchForm.placeIds = data.placeIds
                this.loadWriteOffLists()
            }
        })
    }

    ngOnDestroy() {
        if (this.userStoreService.menuRole$) {
            this.rightSubscription.unsubscribe()
        }
        if (this.userStoreService.user$) {
            this.userRightSubscription.unsubscribe()
        }
    }

    superAdmin: boolean = false

    excelFileSetting: any = {
        code: ''
    }
    dbFieldList: string[] = []
    excelFieldList: string[] = []

    userRightInside: any = {
        read: false,
        write: false,
        update: false,
        delete: false
    }

    searchForm: any = {
        page: 1,
        limit: 10,
        placeIds: [],
        deptIds: []
    }

    okText: string = 'Create'

    dataLists: any[] = []
    totals: number = 0
    editFormDialog: boolean = false
    removeDialog: boolean = false
    handleId: string = ''

    ngOnInit() {
        this.loadWriteOffLists()
    }

    async loadWriteOffLists() {
       const res = await postApiWithAuth('/asset/write-off/list', this.searchForm)
        this.dataLists = res.lists
        this.totals = res.total
    }

    handleRomeve(id: string) {
        this.handleId = id
        this.removeDialog = true
    }

    closeRemoveDialog() {
        this.removeDialog = false
    }


    dateFormat(data: string) {
        return data ? moment(data).format('DD-MM-YYYY HH:mm') : null
    }

    openEdit(id: string) {
        this.routeTo.navigate([`/asset-update/`])
    }

    goToCreate() {
        this.routeTo.navigate(['/asset-create'])
    }

    goToWriteOff() {
        this.routeTo.navigate([`write-off`])
    }

    async preLoadExcelSetting() {
        const res = await getApiWithAuth(`/sys/excel-field-match/code/${this.excelFileSetting.code}`)
        this.dbFieldList = res.fieldLists.map((item: any) => item.dbFieldName)
        this.excelFieldList = res.fieldLists.map((item: any) => item.excelFieldName)
    }

    // Location data
        placeTotal: number = 0
        places: any = []
        placeOptions: ListOption[] = [];
        placeSearchForm: any = {
            placeCode: '',
            placeName: '',
            page: 1,
            limit: 10
        }
        loadPlaceLists = async (
            url: string,
            body: Record<string, unknown>,
        ): Promise<ListOption[]> => {
            const payload = {
              ...this.placeSearchForm,
              ...body,
            }
        
            try {
                const res = await postApiWithAuth(url, payload);
            
                this.places = res ?? [];
                this.placeTotal = res.length ?? 0;
            
                this.placeOptions = this.places.map((a: any) => ({
                    value: a._id,
                    label: `${a.placeCode}`,
                }))
        
                return this.placeOptions
            } catch (error) {
                this.message.error('API request failed')
                throw error
            }
    }
}