import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { Assignment, AssignmentSchema } from './assignment.schema'
import { AssignmentService } from './assignment.service'
import { Department, DepartmentSchema } from '../department/department.schame'
import { DepartmentService } from '../department/department.service'
import { StaffMember, StaffMemberSchema } from '../staff-member/staff-member.schema'
import { StaffMemberService } from '../staff-member/staff-member.service'
import { AssetList } from '../asset-list/asset-list.schame'
import { AssetListFile, AssetListFileSchema } from '../asset-list/asset-list-file.schame'
import { AssetListService } from '../asset-list/asset-list.service'
import { SysUser, SysUserSchema } from '../sys-user/sysUser.schame'
import { SysUserService } from '../sys-user/sysUser.service'
import { TaxInformation, TaxInformationSchema } from '../tax-information/tax-information.schame'
import { Location, LocationSchema } from '../location/location.schame'
import { AssetType, AssetTypeSchema } from '../asset-type/assetType.schame'
import { TaxInformationService } from '../tax-information/tax-information.service'
import { AssetTypeService } from '../asset-type/assetType.service'
import { LocationService } from '../location/location.service'
import { InvRecordService } from '../InvRecord/InvRecord.service'
import { LoginRecord, LoginRecordSchema } from '../sys-user/login-reocrd.schame'
import { SysMenu } from '../sys-menu/sys-menu.schame'
import { SysRole, SysRoleSchema } from '../sys-role/role.schame'
import { SysRoleService } from '../sys-role/role.service'
import { InvRecord, InvRecordSchema } from '../InvRecord/InvRecord.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Assignment.name, schema: AssignmentSchema }, 
            { name: Department.name, schema: DepartmentSchema },
            { name: StaffMember.name, schema: StaffMemberSchema },
            { name: ActionRecord.name, schema: ActionRecordSchema },
            { name: Location.name, schema: LocationSchema },
            { name: AssetList.name, schema: AssetListFileSchema },
            { name: AssetType.name, schema: AssetTypeSchema },
            { name: AssetListFile.name, schema: AssetListFileSchema },
            { name: TaxInformation.name, schema: TaxInformationSchema },
            { name: SysUser.name, schema: SysUserSchema },
            { name: LoginRecord.name, schema: LoginRecordSchema },
            { name: SysRole.name, schema: SysRoleSchema },
            { name: InvRecord.name, schema: InvRecordSchema }
        ])
    ],
    controllers: [],
    providers: [
        ActionRecordService, 
        AssignmentService,
        DepartmentService,
        StaffMemberService,
        AssetListService,
        SysUserService,
        TaxInformationService,
        AssetTypeService,
        LocationService,
        InvRecordService,
        SysRoleService
    ],
    exports: [],
})
export class AssignmentMoudule {}