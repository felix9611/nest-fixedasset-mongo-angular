import { Component, OnInit } from '@angular/core'
import { FilterListApiSmall, ListOption } from '../../../components/filter-list-small/filter-list.component'
import { CommonModule } from '@angular/common'
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { UserStoreService } from '../../../../../state/user.service'
import { NzMessageService } from 'ng-zorro-antd/message'
import { findMenuItem } from '../../../tool-function'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzFormModule } from 'ng-zorro-antd/form'
import { FormsModule } from '@angular/forms'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { postApiWithAuth } from '../../../../../tool/httpRequest-auth'
import moment from 'moment'
import { StaffMemberDetailComponent } from '../staff-member-detail/staff-member-detail.component'

@Component({
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
        FilterListApiSmall,
    ],
    templateUrl: './staff-member-list.component.html',
})
export class StaffMemberListComponent implements OnInit {
    private userRightSubscription: Subscription
    private rightSubscription: Subscription

    constructor(
        private routeTo: Router,
        private userStoreService: UserStoreService,
        private message: NzMessageService,
    ) {
        this.rightSubscription = this.userStoreService.menuRole$.subscribe((data: any) => {
            const answer = findMenuItem(data, 'Staff Member', 'staff-member')
            this.userRightInside = {
                read: answer?.read ?? false,
                write: answer.write ?? false,
                update: answer.update ?? false,
                delete: answer.delete ?? false,
                upload: answer.upload ?? false
                         // keep default value
            }
            // this.excelFileSetting.code = answer?.excelFunctionCode ?? ''
        })
        this.userRightSubscription = this.userStoreService.user$.subscribe((data: any) => {
            this.superAdmin = data.superAdmin
            if (!(data.superAdmin || data.manager)) {
                this.searchForm.deptIds = data.deptIds
                this.searchForm.placeIds = data.placeIds
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

    ngOnInit(): void {
        this.loadStaffLists()
    }

    superAdmin: boolean = false
    manager: boolean = false

    searchForm: any = {
        page: 1,
        limit: 10,
        placeIds: [],
        deptIds: [],
        name: '',
        number: ''
    }

    userRightInside: any = {
        read: false,
        write: false,
        update: false,
        delete: false
    }

    editForm: any = {
        deptId: '',
        placeId: '',
        sysUserId: '',
        avatar: '',
        remark: ''
    }

    dataLists: any[] = []
    totals: number = 0
    okText: string = ''

    async loadStaffLists() {
        const res = await postApiWithAuth('/base/staff-member/list', this.searchForm)
        this.dataLists = res.lists
        this.totals = res.total
    }

    editFormDialog: boolean = false

    goToCreate() {
        this.editForm = {}
        this.editFormDialog = true
        this.okText = 'Create'
    }

    async submitForm() {
        const res = await postApiWithAuth('/base/staff-member/create', this.editForm)

        if (res.error) {
            this.message.error(res.error)
        } else {
            this.message.success('Save successful!')
            this.closeDialog()
            this.loadStaffLists()

            this.editForm = {
                deptId: '',
                placeId: '',
                sysUserId: '',
                avatar: '',
                remark: ''
            }

            this.okText = 'Create'
        }
    }
    
    closeDialog() {
        this.editFormDialog = false
    }

    dateFormat(data: string) {
        return data ? moment(data).format('DD-MM-YYYY HH:mm') : null
    }

    openDetail(id: string) {
        this.routeTo.navigate([`/staff-member-detail`], { queryParams: { id } })
    }

    // Department data
    deptTotal: number = 0
    depts: any = []
    deptOptions: ListOption[] = [];
    deptSearchForm: any = {
        deptCode: '',
        deptName: '',
        page: 1,
        limit: 10
    }
    loadDeptLists = async (
        url: string,
        body: Record<string, unknown>,
    ): Promise<ListOption[]> => {
        const payload = {
          ...this.deptSearchForm,
          ...body,
        }
    
        try {
            const res = await postApiWithAuth(url, payload)
        
            this.depts = res ?? []
            this.deptTotal = res.length ?? 0
        
            this.deptOptions = this.depts.map((a: any) => ({
                value: a._id,
                label: `${a.deptCode}`,
            }));
        
            return this.deptOptions
        } catch (error) {
            this.message.error('API request failed')
            throw error
        }
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

    // Location data
    userTotal: number = 0
    users: any = []
    userOptions: ListOption[] = [];
    userSearchForm: any = {
        username: '',
        email: '',
        page: 1,
        limit: 10
    }
    loadUserLists = async (
        url: string,
        body: Record<string, unknown>,
    ): Promise<ListOption[]> => {
        const payload = {
          ...this.placeSearchForm,
          ...body,
        }
    
        try {
            const res = await postApiWithAuth(url, payload);
        
            this.users = res.lists ?? [];
            this.userTotal = res.total ?? 0;
        
            this.userOptions = this.users.map((a: any) => ({
                value: a._id,
                label: `${a.username}`,
            }))
    
            return this.userOptions
        } catch (error) {
            this.message.error('API request failed')
            throw error
        }
    }
}