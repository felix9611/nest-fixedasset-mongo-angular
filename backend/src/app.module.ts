import { Module } from '@nestjs/common'
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

@Module({
  imports: [
    ActionRecordMoudule,
    AuthModule, 
    CodeTypeMoudule,
    SysRoleMoudule,
    SysUserMoudule,
    DepartmentMoudule,
    AssetTypeMoudule,
    ActionRecordMoudule,
    LocationMoudule,
    VendorMoudule,
    TaxInformationMoudule,
    MongooseModule.forRoot('mongodb://localhost/fixedasset')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
