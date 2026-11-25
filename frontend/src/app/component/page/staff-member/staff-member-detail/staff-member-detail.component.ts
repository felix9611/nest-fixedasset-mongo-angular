import { Component, OnInit } from '@angular/core'
import { FilterListApiSmall, ListOption } from '../../../components/filter-list-small/filter-list.component'
import { CommonModule } from '@angular/common'
import { Subscription } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
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
import { getApiWithAuth, postApiWithAuth } from '../../../../../tool/httpRequest-auth'
import moment from 'moment'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { FilterListApi } from '../../../components/filter-list/filter-list.component'

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
        FilterListApi,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './staff-member-detail.component.html',
})
export class StaffMemberDetailComponent implements OnInit {
    private userRightSubscription: Subscription
    private rightSubscription: Subscription
    constructor(
        private route: ActivatedRoute, 
        private routeTo: Router,
        private message: NzMessageService,
        private userStoreService: UserStoreService
    ) {
        this.rightSubscription = this.userStoreService.menuRole$.subscribe((data: any) => {
            const answer = findMenuItem(data, 'Stock Take', 'stock-takes')
            this.userRightInside = {
                read: answer?.read ?? false,
                write: answer.write ?? false,
                update: answer.update ?? false,
                delete: answer.delete ?? false,
                upload: answer.upload ?? false
                 // keep default value
            }
        })

        this.userRightSubscription = this.userStoreService.user$.subscribe((data: any) => {
            this.superAdmin = data.superAdmin
            this.manager = data.manager
        })
    }
    ngOnInit(): void {
        this.route.queryParams.subscribe((x: any) => {
            this.theId = x.id
            this.getOne()
            this.listAssignedAsset()
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

    userRightInside: any = {}

    manager: boolean = false
    superAdmin: boolean = false
    theId: string = ''
    editStaffForm: any = {
        sysUserId: ''
    }

    sudmitAssetForm: any = {
        assetCode: '',
        assetName: '',
        assetId: ''
    }

    async getOne() {
        const result = await getApiWithAuth(`/base/staff-member/one/${ this.theId}`)
        if (result.error) {
            this.message.error(result.error)
        } else {
            this.editStaffForm = result
        }
    }

    backToList() {
        this.routeTo.navigate([`staff-member`])
    }

    async updateStaffForm() {
        const res = await postApiWithAuth('/base/staff-member/update', this.editStaffForm)
        if (res.error) {
            this.message.error(res.error)
        } else {
            this.message.info('Updated!')
        }
    }

    async assetCodeChanged(assetCode: string) {
        if (assetCode !== '') {
            const data = await getApiWithAuth(`/asset/asset-list/code/${assetCode}`)
            if (data._id) {

                if (!this.superAdmin) {
                    if (data.deptId !== this.editStaffForm.deptId) {
                        this.message.error('Cannot assign for personnel at this department!')
                    } else {
                        this.sudmitAssetForm.assetId = data._id
                        this.sudmitAssetForm.assetName = data.assetName
                        this.sudmitAssetForm.deptId = data.deptId
                    }
                } else {
                    this.sudmitAssetForm.assetId = data._id
                    this.sudmitAssetForm.assetName = data.assetName
                    this.sudmitAssetForm.deptId = data.deptId
                }
            }
        }
    }

    async submitAssetAsign() {
        const finalData: any = {
            staffId: this.editStaffForm._id,
            assetId: this.sudmitAssetForm.assetId,
            deptId: this.sudmitAssetForm.deptId,
            expiryDate: this.sudmitAssetForm.expiryDate,
            remark: this.sudmitAssetForm.remark,
        }

        if (!this.sudmitAssetForm._id) {
            const data = await postApiWithAuth('/asset/assignment/create', finalData)
            if (data._id) {
                this.message.info('Submit successful!')
                this.listAssignedAsset()
            } else {
                this.message.error(data.error)
            }
        }
    }

    cleanAssetForm() {
        this.sudmitAssetForm = {}
    }

    searchAssetListForm: any = {
        page: 1,
        limit: 10
    }

    dateFormat(data: string) {
        return data ? moment(data).format('DD-MM-YYYY HH:mm') : null
    }

    assignedAsset: any = []
    assignedAssetTotal: number = 0
    async listAssignedAsset() {
        const data = await postApiWithAuth(
            `/asset/assignment/list/${this.theId}`, 
            this.searchAssetListForm
        )

        if (data.error) {
            this.message.error(data.error)
        } else {
            this.assignedAsset = data.lists
            this.assignedAssetTotal = data.total
        }
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