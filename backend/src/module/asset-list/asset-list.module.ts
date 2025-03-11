import { Module } from '@nestjs/common'
import { AssetList, AssetListSchema } from './asset-list.schame'
import { MongooseModule } from '@nestjs/mongoose'
import { AssetListService } from './asset-list.service'
import { AssetListController } from './asset-list.cotroller'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { LocationSchema, Location } from '../location/location.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AssetList.name, schema: AssetListSchema }, 
            { name: ActionRecord.name, schema: ActionRecordSchema }, 
            { name: Location.name, schema: LocationSchema }
        ]), AssetList
    ],
    providers: [AssetListService, ActionRecordService],
    controllers: [AssetListController],
    exports: [AssetListService, AssetList]
})
export class AssetListMoudule {}