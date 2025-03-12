import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { AssetTypeMoudule } from './module/asset-type/assetType.module'
import { ActionRecordMoudule} from './module/action-record/actionRecord.module'
import { SysUserMoudule } from './module/sys-user/sysUser.module'
import { AuthModule } from './module/auth/auth.module'
import { SysRoleMoudule } from './module/sys-role/role.module'
import { DepartmentMoudule } from './module/department/department.module'
import { LocationMoudule } from './module/location/location.module'
import { VendorMoudule } from './module/vendor/vendor.module'
import { CodeTypeMoudule } from './module/code-type/codeType.module'
import { TaxInformationMoudule } from './module/tax-information/tax-information.module'
import { AuthGuard } from './module/auth/AuthGuard'
import { APP_GUARD } from '@nestjs/core'
import { BudgetMoudule } from './module/budget/budget.module'
import { SysRoleSchema } from './module/sys-role/role.schame'
import { DepartmentSchema } from './module/department/department.schame'
import { AssetListMoudule } from './module/asset-list/asset-list.module'
import { LoggerMiddleware } from './tool/request-logger.middleware'
import { InvRecordModule } from './module/InvRecord/InvRecord.module'
import { WriteOffModule } from './module/write-off/write-off.module'
import { SysMenuMoudule } from './module/sys-menu/sys-menu.module'

@Module({
  imports: [
    ActionRecordMoudule,
    AssetListMoudule,
    WriteOffModule,
    AssetTypeMoudule,
    AuthModule, 
    BudgetMoudule,
    CodeTypeMoudule,
    DepartmentMoudule,
    InvRecordModule,
    LocationMoudule,
    VendorMoudule,
    TaxInformationMoudule,
    SysRoleMoudule,
    SysUserMoudule,
    SysMenuMoudule,
    MongooseModule.forRoot('mongodb://localhost/fixedasset'),
    MongooseModule.forFeature([
      { name: 'SysRoles', schema: SysRoleSchema },
      { name: 'Department', schema: DepartmentSchema }
    ])
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard // This applies the guard globally
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*') // Logs all requests
  }
}
