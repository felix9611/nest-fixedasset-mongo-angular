import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { UserInfo } from './interface'
// import { CartStateFace, Promotion, CartFace } from './interfaceType'

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
    private initialState: UserInfo = { 
        username: '',
        accessToken: '',
        deptId: 0,
        roleIds: [] 
    }
    private userSubject = new BehaviorSubject<UserInfo>(this.initialState)
    user$ = this.userSubject.asObservable()

    get user(): UserInfo {
        return this.userSubject.value
    }

    setUser(info: UserInfo): void {
        this.userSubject.next(info)
    }

    logout(): void {
        this.userSubject.next({ 
            username: '',
            accessToken: '',
            deptId: 0,
            roleIds: [] 
        })
        localStorage.clear()
    }
}