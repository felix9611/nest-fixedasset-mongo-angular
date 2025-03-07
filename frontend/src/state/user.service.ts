import { Inject, inject, Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { UserInfo } from './interface'
import { ActivatedRouteSnapshot, Router } from '@angular/router'
import { Observable, concatMap, finalize, map, of } from 'rxjs'
import { DOCUMENT } from '@angular/common'
import { LocalStorageService } from './LocalStorageService'
import { HttpService } from '../tool/HttpService'
import { getApiWithAuth } from '../tool/httpRequest-auth'
// import { CartStateFace, Promotion, CartFace } from './interfaceType'

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
    constructor(
        private localStorageService: LocalStorageService,
        private httpService: HttpService
    ) {}

    router = inject(Router)
    private accessToken: string = ''
    private initialState: UserInfo = { 
        username: '',
        accessToken: '',
        avatarBase64: '',
        deptId: 0,
        roleIds: [] 
    }
    private tokenSubject = new BehaviorSubject<string>(this.accessToken)
    private userSubject = new BehaviorSubject<UserInfo>(this.initialState)
    user$ = this.userSubject.asObservable()
    token$ = this.tokenSubject.asObservable()

    get user(): UserInfo {
        return this.userSubject.value
    }

    get token(): string {
        return this.tokenSubject.value
    }

    async isAuthenticated(): Promise<boolean> {
        const token = this.getAccessToken()
        const check = await this.verifyToken()
        if (check) {
            return !!token // Returns true if token exists
        } else {
            this.router.navigate(['/login'])
            return false
        }
    }

    setAccessToken(token: string): void {
        this.tokenSubject.next(`Bearer ${token}`)
        this.localStorageService.setItem('accessToken', `Bearer ${token}`)
    }

    getAccessToken() {
        return this.localStorageService.getItem('accessToken')
    }

    setUser(info: UserInfo): void {
        this.userSubject.next(info)
    }
    

    logout(): void {
        this.userSubject.next({ 
            username: '',
            accessToken: '',
            avatarBase64: '',
            deptId: 0,
            roleIds: [] 
        })
        localStorage.clear()
        this.tokenSubject.next('')
        this.toLoginPage()
    }

    toLoginPage() {
        this.router.navigate(['/login'])
    }

    async loadUserInfo() {
        const data = await getApiWithAuth('/auth/user-profile')
        this.setUser(data)
    }

    async verifyToken(): Promise<boolean> {
        const result: { status: boolean } = await getApiWithAuth('/auth/verify-token')
        if (result.status) {
            return true
        } else {
            return false
        }
    }
}