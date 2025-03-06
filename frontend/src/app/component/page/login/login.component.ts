import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router'
import { NglModule } from 'ng-lightning'
import { FormsModule } from '@angular/forms'
import { UserStoreService } from '../../../../state/user.service'
import { HttpService } from '../../../../tool/HttpService'
import { callPostApi } from '../../../../tool/call-http'
import { postApi } from '../../../../tool/httpRequest-public'


@Component({
    // selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NglModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    constructor(
        private userStoreService: UserStoreService, 
        private router: Router,
        private httpService: HttpService
    ) {}

    loginForm: any = {
        username: '',
        password: ''
    }

    standalone = {
        standalone: true
    }

    async login() {

        const res = await postApi('/auth/login', this.loginForm)
        this.userStoreService.setAccessToken(res.accessToken)
        const checkpoint = await this.userStoreService.isAuthenticated()
        if (checkpoint) {
            this.router.navigate(['/'])
        }
       
    }

    cleanForm() {
        this.loginForm = {
            username: '',
            password: ''
        }
    }
}