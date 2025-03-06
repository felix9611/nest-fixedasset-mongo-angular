import { Routes } from '@angular/router'
import { AssetTypeComponent } from './page/asset/asset-type/asset-type.component'
import { AuthGuard } from '../../state/AuthGuard'

export const pagesRoutes: Routes = [
    {
        path: 'asset-type',
        component: AssetTypeComponent, 
        canActivate: [AuthGuard]
    }
]