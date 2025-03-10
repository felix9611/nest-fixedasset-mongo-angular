import { Module } from '@nestjs/common'
import { AssetList, AssetListSchema } from './asset-list.schame'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
    imports: [MongooseModule.forFeature([{ name: AssetList.name, schema: AssetListSchema }])],
})
export class AssetListMoudule {}