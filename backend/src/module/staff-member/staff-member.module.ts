import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { StaffMember, StaffMemberSchema } from './staff-member.schema'

@Module({
    imports: [MongooseModule.forFeature([{ name: StaffMember.name, schema: StaffMemberSchema }, { name: ActionRecord.name, schema: ActionRecordSchema }])],
    controllers: [],
    providers: [ActionRecordService],
    exports: [],
})
export class StaffMemberMoudule {}