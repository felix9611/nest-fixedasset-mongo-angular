import { Module } from '@nestjs/common'
import { AssetType, AssetTypeSchema } from './assetType.schame'
import { MongooseModule } from '@nestjs/mongoose'
import { AssetTypeService } from './assetType.service'
import { AssetTypeController } from './assetType.controller'

@Module({
    imports: [MongooseModule.forFeature([{ name: AssetType.name, schema: AssetTypeSchema }])],
    controllers: [AssetTypeController],
    providers: [AssetTypeService],
    exports: [],
})
export class AssetTypeMoudule {}