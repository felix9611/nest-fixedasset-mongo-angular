import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { NglModule } from 'ng-lightning'
import { FormsModule } from '@angular/forms'
import { postApi } from '../../../tool/http/httpRequest'


@Component({
    // selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NglModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    loginForm: any = {
        username: '',
        password: ''
    }

    standalone = {
        standalone: true
    }

    async login() {

       const res = await postApi('/auth/login', this.loginForm)
       console.log(res)
    }

    cleanForm() {
        this.loginForm = {
            username: '',
            password: ''
        }
    }
}