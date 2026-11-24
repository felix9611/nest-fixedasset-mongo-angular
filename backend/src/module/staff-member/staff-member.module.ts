import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { StaffMember, StaffMemberSchema } from './staff-member.schema'
import { StaffMemberService } from './staff-member.service'
import { Department, DepartmentSchema } from '../department/department.schame'
import { Location, LocationSchema } from '../location/location.schame'
import { SysUser, SysUserSchema } from '../sys-user/sysUser.schame'
import { StaffMemberController } from './staff-member.controller'
import { DepartmentService } from '../department/department.service'
import { LocationService } from '../location/location.service'
import { SysUserService } from '../sys-user/sysUser.service'
import { SysRoleService } from '../sys-role/role.service'
import { LoginRecord, LoginRecordSchema } from '../sys-user/login-reocrd.schame'
import { SysRole, SysRoleSchema } from '../sys-role/role.schame'

@Module({
    imports: [MongooseModule.forFeature([
        { name: StaffMember.name, schema: StaffMemberSchema }, 
        { name: ActionRecord.name, schema: ActionRecordSchema }, 
        { name: Department.name, schema: DepartmentSchema },
        { name: Location.name, schema: LocationSchema },
        { name: SysUser.name, schema: SysUserSchema },
        { name: LoginRecord.name, schema: LoginRecordSchema },
        { name: SysRole.name, schema: SysRoleSchema }
    ]), StaffMember],
    controllers: [StaffMemberController],
    providers: [
        StaffMemberService, 
        ActionRecordService, 
        DepartmentService, 
        LocationService, 
        SysUserService, 
        SysRoleService
    ],
    exports: [
        StaffMemberService, 
        StaffMember
    ],
})
export class StaffMemberMoudule {}