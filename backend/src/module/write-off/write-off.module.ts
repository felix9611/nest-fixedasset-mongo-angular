import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WriteOff, WriteOffSchema } from './write-off.schema'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { AssetList, AssetListSchema } from '../asset-list/asset-list.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { WriteOffService } from './write-off.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: WriteOff.name, schema: WriteOffSchema },
            { name: ActionRecord.name, schema: ActionRecordSchema },
            { name: AssetList.name, schema: AssetListSchema }
        ])
    ],
    providers: [
        ActionRecordService,
        WriteOffService
    ]
})
export class WriteOffModule {}