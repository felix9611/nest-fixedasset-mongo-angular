import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { AssetListService } from '../asset-list/asset-list.service'
import { StockTake } from './stock-take.schema'
import { StockTakeItem } from './stock-take-item.schema'

@Injectable()
export class StockTakeService {
    constructor(
        @InjectModel(StockTake.name) private stockTakeModel: Model<StockTake>,
        @InjectModel(StockTakeItem.name) private stockTakeItemModel: Model<StockTakeItem>,
        private assetListService: AssetListService
    ) {}
}