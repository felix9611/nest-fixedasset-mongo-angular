import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserStoreService } from '../../../../state/user.service'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzInputModule } from 'ng-zorro-antd/input'
import { FormsModule } from '@angular/forms'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzMessageService } from 'ng-zorro-antd/message'
import { postApiWithAuth } from '../../../../tool/httpRequest-auth'

@Component({
    // selector: 'app-footer',
    imports: [CommonModule, NzFormModule, NzInputModule, FormsModule, NzModalModule],
    templateUrl: './user-info.component.html',
    styleUrl: './user-info.component.css',
})
export class UserInfoComponent implements OnInit {
    constructor(private userService: UserStoreService, private message: NzMessageService) {}

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

    resetPwForm: any = {
        newPassword: '',
        againNewPassword: ''
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

    async submitForm() {
        if (this.resetPwForm.newPassword === this.resetPwForm.againNewPassword) {
            const res = await postApiWithAuth('/sys/user/user-self/update-password', {  password: this.resetPwForm.newPassword })

            if (res.renew === true) {
                this.message.info(res.msg)
                this.closeResetPWDialog()
            } else {
                this.message.error(res.msg)
            }
            
        } else {
            this.message.error('Two passwords are inconsistent!')
        }
    }
}