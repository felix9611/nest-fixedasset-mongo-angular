import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SysRole, SysRoleDocument, SysRoleSchema } from './role.schame'
import { SysRoleService } from './role.service'
import { SysRoleController } from './role.controller'

@Module({
    imports: [MongooseModule.forFeature([{ name: SysRole.name, schema: SysRoleSchema }])],
    controllers: [SysRoleController],
    providers: [SysRoleService],
    exports: [SysRoleService],
})
export class SysRoleMoudule {}