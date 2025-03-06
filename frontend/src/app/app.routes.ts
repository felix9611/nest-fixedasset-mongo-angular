import { Routes } from '@angular/router'
import { LoginComponent } from './component/page/login/login.component'
import { MainComponent } from './layout/main.component'

export const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'login', component: LoginComponent },
   // { path: 'home', component: HomeComponent },
   // { path: 'product-list', component: ProductListComponent },
   // { path: 'store', component: StoreComponent },
   // { path: 'carts', component: CartsComponent }
]
