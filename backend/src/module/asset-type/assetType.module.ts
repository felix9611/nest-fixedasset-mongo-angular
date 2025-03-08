import { Module } from '@nestjs/common'
import { AssetType, AssetTypeSchema } from './assetType.schame'
import { MongooseModule } from '@nestjs/mongoose'
import { AssetTypeService } from './assetType.service'
import { AssetTypeController } from './assetType.controller'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'

@Module({
    imports: [MongooseModule.forFeature([{ name: AssetType.name, schema: AssetTypeSchema }, { name: ActionRecord.name, schema: ActionRecordSchema }]), AssetType],
    controllers: [AssetTypeController],
    providers: [AssetTypeService, ActionRecordService],
    exports: [AssetType, AssetTypeService],
})
export class AssetTypeMoudule {}