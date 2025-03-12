import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { InvRecord, InvRecordSchema } from './InvRecord.schema'
import { InvRecordService } from './InvRecord.service'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { InvRecordController } from './InvRecord.controller'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: InvRecord.name, schema: InvRecordSchema },
            { name: ActionRecord.name, schema: ActionRecordSchema }
        ]),
        InvRecord
    ],
    providers: [InvRecordService, ActionRecordService],
    exports: [InvRecord, InvRecordService],
    controllers: [InvRecordController]
})
export class InvRecordModule {}