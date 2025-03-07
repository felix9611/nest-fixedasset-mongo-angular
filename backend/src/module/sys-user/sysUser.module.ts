import { Module } from '@nestjs/common'
import { SysUserService } from './sysUser.service'
import { SysUser, SysUserSchema } from './sysUser.schame'
import { MongooseModule } from '@nestjs/mongoose'
import { SysUserController } from './sysUser.controlller'
import { SysRoleService } from '../sys-role/role.service'
import { SysRole, SysRoleSchema } from '../sys-role/role.schame'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: SysUser.name, schema: SysUserSchema }, { name: SysRole.name, schema: SysRoleSchema }])
    ],
    controllers: [SysUserController],
    providers: [SysUserService, SysRoleService, SysRole],
    exports: [SysUserService],
})
export class SysUserMoudule {}