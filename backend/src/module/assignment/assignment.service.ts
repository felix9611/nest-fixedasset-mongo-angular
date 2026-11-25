import { Injectable } from '@nestjs/common'
import { Assignment } from './assignment.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { DepartmentService } from '../department/department.service'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { AssetListService } from '../asset-list/asset-list.service'
import { StaffMemberService } from '../staff-member/staff-member.service'

@Injectable()
export class AssignmentService {
    constructor(
        @InjectModel(Assignment.name) private assignmentModel: Model<Assignment>,
        private departmentService: DepartmentService,
        private actionRecordService: ActionRecordService,
        private assetListService: AssetListService,
        private staffMemberService: StaffMemberService
    ) {}
}