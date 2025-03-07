import { Routes } from '@angular/router'
import { AssetTypeComponent } from './page/asset/asset-type/asset-type.component'
import { AuthGuard } from '../../state/AuthGuard'
import { UserInfoComponent } from './page/userInfo/user-info.component'

export const pagesRoutes: Routes = [
    {
        path: 'asset-type',
        component: AssetTypeComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'user-info',
        component: UserInfoComponent,
        canActivate: [AuthGuard]
    }
]