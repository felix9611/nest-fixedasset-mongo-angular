import { Module } from '@nestjs/common'
import { SysUserService } from './sysUser.service'
import { SysUser, SysUserSchema } from './sysUser.schame'
import { MongooseModule } from '@nestjs/mongoose'
import { SysUserController } from './sysUser.controlller'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: SysUser.name, schema: SysUserSchema }])
    ],
    controllers: [SysUserController],
    providers: [SysUserService],
    exports: [SysUserService],
})
export class SysUserMoudule {}