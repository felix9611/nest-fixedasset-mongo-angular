import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { InvRecord, InvRecordSchema } from './InvRecord.schema'
import { InvRecordService } from './InvRecord.service'
import { ActionRecordService } from '../action-record/actionRecord.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: InvRecord.name, schema: InvRecordSchema },
            { name: InvRecord.name, schema: InvRecordSchema }
        ])
    ],
    providers: [InvRecordService, ActionRecordService]
})
export class InvRecordModule {}