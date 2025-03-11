import { Routes } from '@angular/router'
import { AssetTypeComponent } from './page/asset/asset-type/asset-type.component'
import { AuthGuard } from '../../state/AuthGuard'
import { UserInfoComponent } from './page/userInfo/user-info.component'
import { DepartmentComponent } from './page/department/department.component'
import { RoleComponent } from './page/role/role.component'
import { UsersComponent } from './page/users/users.component'
import { CodeTypeComponent } from './page/code-type/code-type.component'
import { VendorComponent } from './page/vendor/vendor.component'
import { LocationComponent } from './page/location/location.component'
import { ActionRecordComponent } from './page/action-record/action-record.component'
import { BudgetComponent } from './page/budget/budget.component'
import { TaxInformationComponent } from './page/tax-information/tax-information.component'
import { AssetFormComponent } from './page/asset/asset-form/asset-form.component'
import { AssetListComponent } from './page/asset/asset-list/asset-list.component'

export const pagesRoutes: Routes = [
    {
        path: 'action-record',
        component: ActionRecordComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'asset-create',
        component: AssetFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'asset-update/:id',
        component: AssetFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'asset-list',
        component: AssetListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'asset-type',
        component: AssetTypeComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'budget',
        component: BudgetComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'code-type',
        component: CodeTypeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'department',
        component: DepartmentComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'location',
        component: LocationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'tax-information',
        component: TaxInformationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'role',
        component: RoleComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'user-info',
        component: UserInfoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'vendor',
        component: VendorComponent,
        canActivate: [AuthGuard]
    }
]