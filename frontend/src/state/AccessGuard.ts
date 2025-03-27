import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router'
import { UserStoreService } from './user.service'
import { findMenuItemByPath } from '../app/component/tool-function'

@Injectable({
    providedIn: 'root'
})
export class AccessGuard implements CanActivate {
    constructor(private userStoreService: UserStoreService, private router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.userStoreService.isAuthenticated()) {
            this.router.navigate(['/login'])
            return false
        } else {
            
            const getUrlPath = route.url[0].path
            let result: GuardResult = false
            this.userStoreService.menuRole$.subscribe((data: any) => {
                const answer = findMenuItemByPath(data, getUrlPath)

                if (!answer) {
                    this.router.navigate(['/'])
                    result = false
                } else {
                    result = true
                }
            })
            return result
        }
        
    }
}