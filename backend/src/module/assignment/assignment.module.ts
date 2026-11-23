import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { Assignment, AssignmentSchema } from './assignment.schema'

@Module({
    imports: [MongooseModule.forFeature([{ name: Assignment.name, schema: AssignmentSchema }, { name: ActionRecord.name, schema: ActionRecordSchema }])],
    controllers: [],
    providers: [ActionRecordService],
    exports: [],
})
export class AssignmentMoudule {}