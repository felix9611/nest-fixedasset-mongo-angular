import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { AssetList, AssetListSchema } from '../asset-list/asset-list.schame'
import { AssetListService } from '../asset-list/asset-list.service'
import { InvRecord, InvRecordSchema } from '../InvRecord/InvRecord.schema'
import { InvRecordService } from '../InvRecord/InvRecord.service'
import { StockTake, StockTakeSchema } from './stock-take.schema'
import { StockTakeItem, StockTakeItemSchema } from './stock-take-item.schema'
import { StockTakeService } from './stock-take.service'
import { StockTakeController } from './stcok-take.controller'
import { AssetListFile, AssetListFileSchema } from '../asset-list/asset-list-file.schame'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: StockTake.name, schema: StockTakeSchema }, 
            { name: StockTakeItem.name, schema: StockTakeItemSchema }, 
            { name: ActionRecord.name, schema: ActionRecordSchema },
            { name: AssetList.name, schema: AssetListSchema },
            { name: AssetListFile.name, schema: AssetListFileSchema },
            { name: InvRecord.name, schema: InvRecordSchema }
        ]), 
    ],
    providers: [ActionRecordService, StockTakeService, AssetListService, InvRecordService],
    exports: [],
    controllers: [StockTakeController]
})
export class StockTakeMoudule {}