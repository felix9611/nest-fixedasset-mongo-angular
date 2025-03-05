import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { AssetTypeMoudule } from './module/asset-type/assetType.module'
import { ActionRecordMoudule} from './module/action-record/actionRecord.module'
import { SysUserMoudule } from './module/sys-user/sysUser.module'
import { AuthModule } from './module/auth/auth.module'

@Module({
  imports: [
    AssetTypeMoudule,
    ActionRecordMoudule,
    SysUserMoudule,
    AuthModule, 
    MongooseModule.forRoot('mongodb://localhost/fixedasset')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
