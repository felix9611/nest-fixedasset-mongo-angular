import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { NglModule } from 'ng-lightning'
import { FormsModule } from '@angular/forms'
import { UserStoreService } from '../../../../state/user.service'
import { HttpService } from '../../../../tool/HttpService'
import { callPostApi } from '../../../../tool/call-http'
import { postApi } from '../../../../tool/httpRequest-public'
import { NzMessageService } from 'ng-zorro-antd/message'
import { postApiWithAuth } from '../../../../tool/httpRequest-auth'


@Component({
    // selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, NglModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    constructor(
        private userStoreService: UserStoreService, 
        private router: Router,
        private httpService: HttpService,
        private message: NzMessageService
    ) {}

    loginForm: any = {
        username: '',
        password: ''
    }

    standalone = {
        standalone: true
    }

    async login() {

        const res = await postApiWithAuth('/auth/login', this.loginForm)

        if (!res.msg) {
            this.userStoreService.setAccessToken(res.accessToken)
            const checkpoint = await this.userStoreService.isAuthenticated()
            if (checkpoint) {
                this.router.navigate(['/'])
            }
        } else {
            this.message.error(res.msg)
        }
        
       
    }

    cleanForm() {
        this.loginForm = {
            username: '',
            password: ''
        }
    }
}