import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { UserInfo } from '../../../../state/interface'
import { UserStoreService } from '../../../../state/user.service'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzInputModule } from 'ng-zorro-antd/input'
import { FormsModule } from '@angular/forms'

@Component({
    // selector: 'app-footer',
    imports: [CommonModule, NzFormModule, NzInputModule],
    templateUrl: './user-info.component.html',
    styleUrl: './user-info.component.css',
})
export class UserInfoComponent implements OnInit {
    constructor(private userService: UserStoreService) {}

    userInfo: any = { 
        _id: '',
        username: '',
        accessToken: '',
        avatarBase64: '',
        deptId: 0,
        roleIds: [],
        roleLists: [],
        email: '', 
    }

    resetPwDialog: boolean = false

    ngOnInit() {
        this.userService.user$.subscribe(user => {
            console.log(user)
            this.userInfo = user
            
        })
    } 

    openResetPWDialog() {
        this.resetPwDialog = true
    }

    closeResetPWDialog() {
        this.resetPwDialog = false
    }
}