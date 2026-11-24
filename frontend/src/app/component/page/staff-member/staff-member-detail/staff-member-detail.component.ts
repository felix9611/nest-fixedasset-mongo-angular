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
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './staff-member-detail.component.html',
})
export class StaffMemberDetailComponent implements OnInit {
    
    constructor(
        private route: ActivatedRoute, 
        private routeTo: Router,
        private message: NzMessageService,
        private userStoreService: UserStoreService
    ) {}
    ngOnInit(): void {
        this.route.queryParams.subscribe((x: any) => {
            this.theId = x.id
            this.getOne()
        })
    }

    theId: string = ''
    editStaffForm: any = {}
    
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
}