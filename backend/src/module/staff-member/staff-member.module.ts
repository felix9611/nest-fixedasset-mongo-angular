import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { StaffMember, StaffMemberSchema } from './staff-member.schema'
import { StaffMemberService } from './staff-member.service'
import { Department, DepartmentSchema } from '../department/department.schame'
import { LocationSchema } from '../location/location.schame'
import { SysUser, SysUserSchema } from '../sys-user/sysUser.schame'
import { StaffMemberController } from './staff-member.controller'

@Module({
    imports: [MongooseModule.forFeature([
        { name: StaffMember.name, schema: StaffMemberSchema }, 
        { name: ActionRecord.name, schema: ActionRecordSchema }, 
        { name: Department.name, schema: DepartmentSchema },
        { name: Location.name, schema: LocationSchema },
        { name: SysUser.name, schema: SysUserSchema }
    ]), StaffMember],
    controllers: [StaffMemberController],
    providers: [StaffMemberService, ActionRecordService],
    exports: [StaffMemberService, StaffMember],
})
export class StaffMemberMoudule {}